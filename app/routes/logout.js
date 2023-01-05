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
    const signoutUrl = new URL(config.defraId.signoutUrl)
    signoutUrl.searchParams.append('post_logout_redirect_uri', config.defraId.signoutRedirectUrl)
    signoutUrl.searchParams.append('id_token_hint', token)

    return h.redirect(signoutUrl)
  }
}
