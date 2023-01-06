const { signout } = require('../auth')

module.exports = {
  method: 'GET',
  path: '/apply/signout',
  handler: async (request, h) => {
    await signout(request)
    return h.redirect('/')
  }
}
