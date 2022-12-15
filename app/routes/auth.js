const auth = require('../auth')

module.exports = {
  method: ['GET', 'POST'],
  path: '/apply/signin-oidc',
  options: {
    auth: { mode: 'try' },
    handler: async (request, h) => {
      await auth.authenticate(request)
      return h.view('index')
    }
  }
}
