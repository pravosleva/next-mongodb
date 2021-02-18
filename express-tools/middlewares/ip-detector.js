module.exports = function (req, res, next) {
  const ip = req.headers['x-real-ip'] || req.connection.remoteAddress
  // NOTE: http://code-samples.space/notes/601d00a80883d4603bb0e8ab

  req.clientIp = ip

  next()
}
