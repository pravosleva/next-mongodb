import { CrossDeviceSingleton, TMapValue } from '~/utils/next/_crossDeviceState'

type TEnhancedReq = {
  crossDeviceState: CrossDeviceSingleton
  clientIp: string
  geo: { [key: string]: any }
}

const crossdeviceApi = async (
  req: {
    method: any
    body: any
  } & TEnhancedReq,
  res: {
    status: (
      arg0: number
    ) => {
      (): any
      new (): any
      json: {
        (arg0: { message?: string; success: boolean; _originalReqBody?: any; _yourData?: any; qr?: string }): any
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
        const reqId = String(new Date().getTime())
        const qrPayload = JSON.stringify(lsData)
        const yourData: { reqId: string } & Partial<TMapValue> = {
          ip,
          geo,
          reqId,
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
          message: `Error: ${e?.message || '(no err msg)'}`,
          _originalReqBody: body,
        })
      }
    default:
      return res
        .status(500)
        .json({ success: false, message: `Не предусмотрено для method= ${method}`, _originalReqBody: body })
  }
}

export default crossdeviceApi
