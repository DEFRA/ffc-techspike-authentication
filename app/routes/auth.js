const manualAuth = require('../auth/manual-auth')

module.exports = {
  method: 'GET',
  path: '/apply/signin-oidc',
  options: {
    auth: { mode: 'try' },
    handler: async (request, h) => {
      try {
        const authenticate = await manualAuth.authenticate(request)

        if (!authenticate) {
          return h.redirect('/')
        }

        return h.redirect('/user-details')
      } catch (err) {
        console.log('Error authenticating', err)
      }
      return h.view('error-pages/500').code(500)
    }
  }
}
