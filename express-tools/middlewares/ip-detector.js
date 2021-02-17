// const userIP = require('user-ip')

module.exports = function (req, res, next) {
  // const ip = userIP(req)
  const ip = req.headers['x-real-ip']
  // NOTE: http://code-samples.space/notes/601d00a80883d4603bb0e8ab

  req.clientIp = ip

  next()
}
