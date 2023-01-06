const auth = require('../auth')

module.exports = {
  method: 'GET',
  path: '/signin',
  options: {
    auth: false,
    handler: async (request, h) => {
      try {
        const authUrl = auth.getAuthenticationUrl(request)
        return h.redirect(authUrl)
      } catch (err) {
        console.log('Error authenticating', err)
      }
    }
  }
}
