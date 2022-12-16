const manualAuth = require('../manual-auth')
const session = require('../session')
const { tokens } = require('../session/keys')

module.exports = {
  method: 'GET',
  path: '/apply/signin-oidc',
  options: {
    auth: { mode: 'try' },
    handler: async (request, h) => {
      try {
        await manualAuth.authenticate(request)
        const token = session.getToken(request, tokens.idToken, true)
        return h.view('user-details', { token })
      } catch (err) {
        console.log('Error authenticating', err)
      }
      return h.view('500').code(500)
    }
  }
}
