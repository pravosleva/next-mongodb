/* eslint-disable no-console */
import { CrossDeviceSingleton, TMapValue } from '~/utils/next/_crossDeviceState'
import Cookies from 'cookies'
import { Socket } from 'socket.io'
import { EActions } from '~/socket-logic'

type TEnhancedReq = {
  crossDeviceState: CrossDeviceSingleton
  clientIp: string
  geo: { [key: string]: any }
}

const crossdeviceApi = async (
  req: {
    id: string
    method: any
    body: any
    query?: any
    io: Socket
    socketId: string
  } & TEnhancedReq,
  res: {
    status: (
      arg0: number
    ) => {
      (): any
      new (): any
      json: {
        (arg0: {
          message?: string
          success: boolean
          _originalReqBody?: any
          _yourData?: any
          qr?: string
          _originalReqQuery?: any
          lsData?: any
          state?: any
        }): any
        new (): any
      }
      send: { (arg0: { message: string; _originalReqBody: any }): any; new (): any }
    }
  }
) => {
  const {
    // query: { id },
    method,
    body,
  } = req
  // NOTE: https://maxschmitt.me/posts/next-js-cookies/
  // @ts-ignore
  const cookies = new Cookies(req, res)

  switch (method) {
    case 'POST':
      const { lsData, socketId } = body

      try {
        if (!lsData || !socketId)
          return res.status(500).json({
            message: `Проверьте данные, req.body.lsData is ${typeof lsData}; req.body.socketId is ${typeof socketId}`,
            success: false,
            _originalReqBody: body,
          })

        const ip = req.clientIp
        const geo = req.geo

        // --- Identity tool
        const maxAgeInDays = 1

        let reqId = cookies.get('crossdevice-req-id')

        console.log('--- redId; OLD:', reqId)

        if (!reqId) {
          reqId = req.id
          cookies.set('crossdevice-req-id', reqId, {
            httpOnly: true, // true by default
            maxAge: maxAgeInDays * 24 * 60 * 60 * 1000,
          })
          console.log('New cookie set')
        }

        console.log('NEW:', reqId)
        console.log('---')
        // ---

        const qrPayload = JSON.stringify({ descr: 'This obj is unnecessary. For example only.' })
        const yourData: { reqId: string } & Partial<TMapValue> = {
          ip,
          geo,
          reqId: reqId || `No req.id: ${typeof reqId}`,
          lsData,
          qrPayload,
          socketId,
        }

        // @ts-ignore
        req.crossDeviceState.addSomeonesLocalNotes(yourData)

        const qr = await req.crossDeviceState.getQR(reqId)

        // TODO: Set cookie with reqId or hash...

        return res.status(200).json({
          _yourData: yourData,
          qr,
          success: true,
        })
      } catch (err) {
        return res.status(500).send({
          // @ts-ignore
          message: typeof err === 'string' ? err : `Error: ${err?.message || '(no err.message)'}`,
          _originalReqBody: body,
        })
      }
    case 'GET':
      try {
        const {
          query: { payload, tst }, // NOTE: req.id as Map structure key
        } = req

        if (tst === 'state') {
          return res.status(200).json({
            state: req.crossDeviceState.getState(),
            success: false,
          })
        }

        if (!payload) throw new Error('req.query.payload should be provided')
        if (!req.crossDeviceState.state.has(payload))
          // throw new Error('Извините, данных не обнаружено, попробуйте повторить процедуру еще раз')
          return res.status(404).json({
            message: 'Данных не обнаружено, попробуйте повторить процедуру переноса еще раз',
            success: false,
          })

        let status = 500
        const result = await req.crossDeviceState
          .getSomeonesLocalNotesOrDeletePromise(payload)
          .then(({ message, data, haveToBeKilled }) => {
            status = 200

            // --- NOTE: Notificaion by socket
            const socketId = data?.socketId
            if (!!socketId) req.io.to(socketId).emit(EActions.QR_USED, { message, haveToBeKilled })
            // ---

            return {
              data,
              message,
              success: true,
            }
          })
          .catch((err) => {
            status = 400
            return {
              message: typeof err === 'string' ? err : err.message || 'No err.message, Извините, что-то пошло не так',
              success: false,
            }
          })

        // console.log('--- RES')
        // console.log(status)
        // console.log(result)
        // console.log('---')

        return res.status(status).json(result)
      } catch (err) {
        return res.status(500).json({
          success: false,
          // @ts-ignore
          message: typeof err === 'string' ? err : `Error: ${err?.message || '(no err.message)'}`,
          _originalReqQuery: req.query,
        })
      }
    default:
      return res
        .status(500)
        .json({ success: false, message: `Не предусмотрено для method= ${method}`, _originalReqBody: body })
  }
}

export default crossdeviceApi
