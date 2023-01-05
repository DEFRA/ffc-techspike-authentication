
const config = require('../config')
const authCookie = require('@hapi/cookie')
const { hasExpired } = require('../auth/token-expiry')
const tokenSession = require('../session')
const { tokens } = require('../session/keys')
const auth = require('../auth')

module.exports = {
  plugin: {
    name: 'auth',
    register: async (server) => {
      await server.register(authCookie)
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
        redirectTo: '/login',
        validateFunc: async (request, session) => {
          let valid = true
          console.log('Validating session')
          const token = tokenSession.getToken(request, tokens.refreshToken)

          if (!token) {
            console.log('No refresh token found')
            return { valid: false, credentials: null }
          }

          if (hasExpired(request)) {
            console.log('Refresh token has expired. Issuing new tokens.')
            valid = auth.authenticate(request, true)
          }

          return { valid, credentials: session }
        }
      })

      server.auth.default('session-auth')
    }
  }
}
