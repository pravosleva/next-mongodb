const userIP = require('user-ip')

module.exports = function (req, res, next) {
  const ip = userIP(req)

  req.clientIp = ip

  next()
}
