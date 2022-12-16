const manualAuth = require('../manual-auth')

module.exports = {
  method: 'GET',
  path: '/manual-auth-flow',
  options: {
    auth: false,
    handler: async (request, h) => {
      try {
        const authUrl = manualAuth.getAuthenticationUrl()
        return h.redirect(authUrl)
      } catch (err) {
        console.log('Error authenticating', err)
      }
    }
  }
}
