const { signout } = require('../auth/manual-auth')

module.exports = {
  method: 'GET',
  path: '/logout',
  handler: async (request, h) => {
    await signout(request)
    return h.redirect('/')
  }
}
