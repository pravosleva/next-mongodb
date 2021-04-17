const crossdeviceApi = async (req, res) => {
  const {
    query: { id },
    method,
  } = req

  switch (method) {
    case 'GET':
      try {
        // const ip = req.clientIp
        // const geo = req.geo
        const state = req.crossDeviceState.getState()

        return res.status(200).json({
          state,
          success: true,
        })
      } catch (e) {
        return res.status(500).send({
          message: `Error: ${e?.message || '(no err msg)'}`,
        })
      }
    default:
      return res.status(500).json({ success: false, message: `Не предусмотрено для method= ${method}` })
  }
}

export default crossdeviceApi
