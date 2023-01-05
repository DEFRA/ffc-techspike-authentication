const { signout } = require('../auth')

module.exports = {
  method: 'GET',
  path: '/logout',
  handler: async (request, h) => {
    const signoutUrl = await signout(request)
    return h.redirect(signoutUrl)
  }
}
