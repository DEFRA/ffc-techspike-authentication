const { signout } = require('../auth')

module.exports = {
  method: 'GET',
  path: '/logout',
  handler: async (request, h) => {
    await signout(request)
    return h.redirect('/')
  }
}
