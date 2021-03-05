const express = require('express')

const expressApi = express()
const usersRouter = require('./users')
const commonRouter = require('./common')

expressApi.use('/users', usersRouter)
expressApi.use('/common', commonRouter)

module.exports = expressApi
