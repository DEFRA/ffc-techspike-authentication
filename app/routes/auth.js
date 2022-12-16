const auth = require('../auth')

module.exports = {
  method: 'GET',
  path: '/apply/signin-oidc',
  options: {
    auth: { mode: 'try' },
    handler: async (request, h) => {
      try {
        await auth.authenticate(request)
        return h.view('index')
      } catch (err) {
        console.log('Error authenticating', err)
      }
      return h.view('500').code(500)
    }
  }
}
