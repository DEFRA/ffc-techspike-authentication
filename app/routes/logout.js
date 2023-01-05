const { signout } = require('../auth')
const config = require('../config').authConfig
const session = require('../session')
const { tokens } = require('../session/keys')

module.exports = {
  method: 'GET',
  path: '/logout',
  handler: async (request, h) => {
    await signout(request)
    const token = session.getToken(request, tokens.idToken)
    const signoutUrl = `${config.defraId.signoutUrl}?post_logout_redirect_uri=$https://localhost:3000&id_token_hint=${token}`
    return h.redirect(signoutUrl)
  }
}
