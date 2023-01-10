const Hapi = require('@hapi/hapi')
const config = require('./config')
const catbox = config.useRedis
  ? require('@hapi/catbox-redis')
  : require('@hapi/catbox-memory')
const cacheConfig = config.useRedis ? config.cache.options : {}

async function createServer () {
  const serverOptions = {
    cache: [{
      provider: {
        constructor: catbox,
        options: cacheConfig
      }
    }],
    port: config.port,
    debug: { request: 'error' },
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    router: {
      stripTrailingSlash: true
    }
  }
  console.log('config.useHttps', config.useHttps)
  if (config.useHttps) {
    const fs = require('fs')
    const Path = require('path')
    const Http2 = require('http2')

    const readContentsFromFile = filePath => fs.readFileSync(Path.join(__dirname, filePath))

    const serverOptions = {
      key: readContentsFromFile('localhost-privkey.pem'),
      cert: readContentsFromFile('localhost-cert.pem')
    }

    const listener = Http2.createSecureServer(serverOptions)
    serverOptions.listener = listener
  }

  const server = Hapi.server(serverOptions)

  await server.register(require('./plugins/auth'))
  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/session'))
  await server.register(require('./plugins/error-pages'))
  await server.register(require('./plugins/view-context'))
  await server.register(require('./plugins/views'))

  return server
}

module.exports = createServer
