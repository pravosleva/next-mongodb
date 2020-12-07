const express = require('express')
const next = require('next')
// const bodyParser = require("body-parser")
const expressRouter = require("./express-tools/e-api") // New addition
const fs = require('fs')
const logger = require('tracer').console({
  transport: function(data) {
    console.log(data.output)
    fs.appendFile('./file.log', data.rawoutput + '\n', err => {
      if (err) throw err
    })
  }
})

const isDev = process.env.NODE_ENV !== 'production'
const app = next({ dev: isDev })
const handle = app.getRequestHandler()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

// const fs = require('fs')
// const dotenv = require('dotenv')
// const isProduction = process.env.NODE_ENV === 'production'
// const envFileName = isProduction ? '.env.prod' : '.env.dev'
// const env = dotenv.parse(fs.readFileSync(envFileName))

// dotenv.config(envFileName);

// console.log(process.env.MONGO_URI)

// const envConfig = dotenv.parse(fs.readFileSync(envFileName));
// for (const k in envConfig) process.env[k] = envConfig[k];

app.prepare()
  .then(() => {
    const server = express()

    // SAMPLE:
    server.use('/api/*', (req, res, next) => {
      logger.log('hello')
      logger.trace('hello', 'world')
      logger.debug('hello %s', 'world', 123)
      logger.info('hello %s %d', 'world', 123, { foo: 'bar' })
      logger.warn('hello %s %d %j', 'world', 123, { foo: 'bar' })
      logger.error(
        'hello %s %d %j',
        'world',
        123,
        { foo: 'bar' },
        [1, 2, 3, 4],
        Object
      )
      // const actualPage = '/post'
      // const queryParams = { id: req.params.id } 
      // app.render(req, res, actualPage, queryParams)
      console.log('--- /notes/:id')
      next()
    })

    // Middleware
    // server.use(bodyParser.json());

    /**
     * Router Middleware
     * Router - /e-api/*
     * Method - *
     */
    server.use('/e-api', expressRouter)

    server.all('*', (req, res) => {
      return handle(req, res)
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
