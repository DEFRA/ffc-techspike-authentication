const auth = require('../auth')

module.exports = {
  method: 'GET',
  path: '/auth-flow',
  options: {
    auth: false,
    handler: async (request, h) => {
      try {
        const authUrl = await auth.getAuthenticationUrl(request)
        return h.redirect(authUrl)
      } catch (err) {
        console.log('Error authenticating', err)
      }
      return h.view('500').code(500)
    }
  }
}
