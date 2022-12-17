
const config = require('../config')
const authCookie = require('@hapi/cookie')
const auth = require('../auth/manual-auth')

module.exports = {
  plugin: {
    name: 'auth',
    register: async (server) => {
      await server.register(authCookie)
      // await auth.testOpenId()
      server.auth.strategy('session-auth', 'cookie', {
        cookie: {
          name: 'session-auth',
          password: config.authConfig.cookie.password,
          ttl: config.authConfig.cookie.ttl,
          path: '/',
          isSecure: config.isProd,
          isSameSite: 'Lax' // Needed for the post authentication redirect
        },
        keepAlive: true, // Resets the cookie ttl after each route
        redirectTo: '/login'
      })

      server.auth.default('session-auth')

      server.ext('onPreAuth', async (request, h) => {
        if (request.auth.credentials) {
          console.log('refresh token')
          await auth.authenticate(request, true)
        }
        return h.continue
      })
    }
  }
}
