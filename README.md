# next-mongodb

## [Life Demo](http://code-samples.space/)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/zeit/next.js/tree/canary/packages/create-next-app).

- [Stack](#stack)
- [Roadmap](#roadmap)
- [API](#api)
- [Getting Started](#getting-started)
  - [PM2 ecosystem config](#pm2)
- [Environments](#envs)
  - [Development](#envs-development)
  - [Production](#envs-production)
- [Extra info (MongoDB)](#mongodb-extra-info)
- [Learn More](#learn-more)
- [Deploy on ZEIT Now](#deploy-on-zeit-now)

> https://github.com/typicode/husky/issues/326#issuecomment-692317612

## stack

- react@16.13.1
- next@9.3.6
- express@4.17.1
- socket.io@3.0.4
- @material-ui/core@4.11.2

## [roadmap](http://code-samples.space/notes/5fd1ee767d536a022794e43e)

## api

_TODO_

## getting-started

```bash
npm i
# or
yarn
```

### pm2

### `pm2 start ecosystem.dev.config.js`

```js
module.exports = {
  apps: [
    {
      name: 'notes-2020-next-mongoose-dev',
      cwd: __dirname + '/.',
      script: 'yarn',
      args: 'dev',
      interpreter: 'none',
      env: {
        MONGO_URI: '<YOUR>',
        JWT_SECRET: '<RANDOM_STRING>',
        EXPRESS_JWT_MAXAGE_IN_DAYS: 3,
        EXPRESS_IS_USER_SIGNUP_ENABLED: 1,
        NEXT_APP_QR_BASE_URL: 'http://code-samples.space',
      },
    },
  ],
}
```

### `pm2 start ecosystem.prod.config.js`

```js
module.exports = {
  apps: [
    {
      name: 'notes-2020-next-mongoose',
      cwd: __dirname + '/.',
      script: 'yarn',
      args: 'start:prod',
      interpreter: 'none',
      env: {
        MONGO_URI: '<YOUR>',
        JWT_SECRET: '<RANDOM_STRING>',
        EXPRESS_JWT_MAXAGE_IN_DAYS: 3,
        EXPRESS_IS_USER_SIGNUP_ENABLED: 1,
        NEXT_APP_QR_BASE_URL: 'http://code-samples.space',
      },
    },
  ],
}
```

## envs

### envs-development

`.env.dev`

```bash
MONGO_URI=<YOUR>
NEXT_APP_API_ENDPOINT=http://localhost:9000/api
NEXT_APP_SOCKET_API_ENDPOINT=http://localhost:9000
NEXT_APP_EXPRESS_API_ENDPOINT=http://localhost:9000/e-api
NEXT_APP_COOKIE_MAXAGE_IN_DAYS=2
NEXT_APP_QR_BASE_URL=http://code-samples.space
```

### envs-production

`.env.prod`

```bash
MONGO_URI=<YOUR>
NEXT_APP_API_ENDPOINT=http://<DOMAIN>/api
NEXT_APP_SOCKET_API_ENDPOINT=http://<DOMAIN>
NEXT_APP_EXPRESS_API_ENDPOINT=http://<DOMAIN>/e-api
NEXT_APP_COOKIE_MAXAGE_IN_DAYS=2
NEXT_APP_QR_BASE_URL=http://code-samples.space
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:9000](http://localhost:9000) with your browser to see the result.

### `deploy-app-config.json` sample:

```json
{
  "prod:build-send-next": {
    "user": "root",
    "host": "<HOST>",
    "port": "22",
    "files": "./.next/*",
    "path": "/home/projects/next-mongodb/.next",
    "pre-deploy-local": "yarn local:cleanup; yarn build",
    "pre-deploy-remote": "rm -rf /home/projects/next-mongodb/.next/*"
  },
  "prod:copy-server-dist": {
    "user": "root",
    "host": "<HOST>",
    "port": "22",
    "files": "./server-dist/*",
    "path": "/home/projects/next-mongodb/server-dist",
    "post-deploy": "pm2 restart 0 --update-env"
  },
  "dev": {},
  "staging": {}
}
```

## mongodb-extra-info

Mongoose allows you to query your collections in different ways like: [Official Documentation](https://mongoosejs.com/docs/api.html#model_Model.find)

```js
// MyModel.isPrivate not equal true
MyModel.find({ isPrivate: { $ne: true } })

// named john and at least 18
MyModel.find({ name: 'john', age: { $gte: 18 } })

// executes, passing results to callback
MyModel.find({ name: 'john', age: { $gte: 18 } }, function (err, docs) {})

// executes, name LIKE john and only selecting the "name" and "friends" fields
MyModel.find({ name: /john/i }, 'name friends', function (err, docs) {})

// passing options
MyModel.find({ name: /john/i }, null, { skip: 10 })

// passing options and executes
MyModel.find({ name: /john/i }, null, { skip: 10 }, function (err, docs) {})

// executing a query explicitly
var query = MyModel.find({ name: /john/i }, null, { skip: 10 })
query.exec(function (err, docs) {})

// using the promise returned from executing a query
var query = MyModel.find({ name: /john/i }, null, { skip: 10 })
var promise = query.exec()
promise.addBack(function (err, docs) {})
```

## learn-more

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/zeit/next.js/) - your feedback and contributions are welcome!

## deploy-on-zeit-now

The easiest way to deploy your Next.js app is to use the [ZEIT Now Platform](https://zeit.co/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
