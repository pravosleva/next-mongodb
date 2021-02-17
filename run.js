/* eslint-disable no-console */
// const dotenv = require('dotenv')
// const isProduction = process.env.NODE_ENV === 'production'
// const envFileName = isProduction ? '.env.prod' : '.env.dev'
// dotenv.config(envFileName);

import { socketLogic } from '~/socket-logic'

const next = require('next')
const expressRouter = require('./express-tools/e-api')

const isDev = process.env.NODE_ENV !== 'production'
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const nextApp = next({ dev: isDev })
const nextHanlder = nextApp.getRequestHandler()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
const requestIpMW = require('./express-tools/middlewares/request-ip')
const geoipLiteMW = require('./express-tools/middlewares/geoip-lite')

const _customIO = socketLogic(io)

nextApp
  .prepare()
  .then(() => {
    app.use('*', requestIpMW, geoipLiteMW)
    // NOTE: For example: const ip = req.clientIp; const geo = req.geo;

    /**
     * Router Middleware
     * Router - /e-api/*
     * Method - *
     */
    app.use('/e-api', expressRouter)

    app.all('*', (req, res) => {
      req.io = _customIO
      return nextHanlder(req, res)
    })

    server.listen(PORT, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${PORT}`)
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
