const auth = require('../auth')
const session = require('../session')
const { tokens } = require('../session/keys')

module.exports = {
  method: 'GET',
  path: '/login',
  options: {
    auth: false,
    handler: async (request, h) => {
      try {
        const token = session.getToken(request, tokens.refreshToken)
        console.log('Refresh token', token)
        const authUrl = auth.getAuthenticationUrl(request)
        return h.redirect(authUrl)
      } catch (err) {
        console.log('Error authenticating', err)
      }
    }
  }
}
