const geoip = require('geoip-lite')

module.exports = function (req, res, next) {
  if (!!req.clientIp) {
    // NOTE: See also off doc
    // https://www.npmjs.com/package/geoip-lite#looking-up-an-ip-address
    req.geo = geoip.lookup(req.clientIp)
  }

  next()
}
