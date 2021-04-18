import { CrossDeviceSingleton, TMapValue } from '~/utils/next/_crossDeviceState'

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

  switch (method) {
    case 'POST':
      const { lsData } = body

      try {
        if (!lsData)
          return res.status(500).json({
            message: `Проверьте данные, req.body.lsData is ${typeof lsData}`,
            success: false,
            _originalReqBody: body,
          })

        const ip = req.clientIp
        const geo = req.geo
        const reqId = req.id // String(new Date().getTime())

        const qrPayload = JSON.stringify(lsData)
        const yourData: { reqId: string } & Partial<TMapValue> = {
          ip,
          geo,
          reqId: reqId || `No req.id: ${typeof reqId}`,
          lsData,
          qrPayload,
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
      } catch (e) {
        return res.status(500).send({
          message: `Error: ${e?.message || '(no err.message)'}`,
          _originalReqBody: body,
        })
      }
    case 'GET':
      try {
        const {
          query: { payload }, // NOTE: req.id as Map structure key
        } = req

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
          .then(({ message, data }) => {
            status = 200
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
      } catch (e) {
        return res.status(500).json({
          success: false,
          message: `Error: ${e?.message || '(no err.message)'}`,
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
