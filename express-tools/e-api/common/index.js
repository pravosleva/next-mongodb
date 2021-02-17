const express = require('express')
const router = express()

router.get('/my-ip', async (req, res) => {
  try {
    const ip = req.clientIp
    const geo = req.geo

    res.json({ ip, geo, success: true })
  } catch (e) {
    res.status(500).send({
      message: `Error: ${e?.message || '(no err msg)'}`,
    })
  }
})

module.exports = router
