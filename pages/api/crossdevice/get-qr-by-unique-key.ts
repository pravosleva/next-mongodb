/* eslint-disable no-console */
import {
  CrossDeviceSingleton,
  // TMapValue,
} from '~/utils/next/_crossDeviceState'
import Cookies from 'cookies'
import { Socket } from 'socket.io'
// import { EActions } from '~/socket-logic'

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
  const logged_req_id = cookies.get('crossdevice-req-id')

  switch (method) {
    case 'GET':
      try {
        // const { query: { logged_req_id } } = req

        if (!logged_req_id) throw new Error('req.query.logged_req_id should be provided')
        if (!req.crossDeviceState.state.has(logged_req_id))
          // throw new Error('Извините, данных не обнаружено, попробуйте повторить процедуру еще раз')
          return res.status(404).json({
            message: 'Данных не обнаружено, попробуйте повторить процедуру переноса еще раз',
            success: false,
          })

        let status = 500
        let result: any
        // const qrData = req.crossDeviceState.getQRByLoggedReqId(logged_req_id)
        // const qrData = req.crossDeviceState.state.get(logged_req_id)
        const qr = await req.crossDeviceState.getQR(logged_req_id)

        if (!!qr) {
          status = 200
          result = {
            qr,
            success: true,
            _originalReqQuery: req.query,
          }
        } else {
          status = 404
          result = {
            message: 'Not found in state',
            success: false,
            _originalReqQuery: req.query,
          }
        }

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
