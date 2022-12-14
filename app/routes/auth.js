const auth = require('../auth')

module.exports = {
  method: ['GET', 'POST'],
  path: '/apply/signin-oidc',
  options: {
    auth: { mode: 'try' },
    handler: async (request, h) => {
      console.log('Authenticating', request.query)
      await auth.authenticate(request.query.code, request.cookieAuth)
      console.log(request.auth.isAuthenticated)
      return h.view('index')
    }
  }
}
