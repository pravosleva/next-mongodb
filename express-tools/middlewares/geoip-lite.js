const geoip = require('geoip-lite')

module.exports = function (req, res, next) {
  if (!!req.clientIp) {
    req.geo = geoip.lookup(req.clientIp)
  }

  next()
}
