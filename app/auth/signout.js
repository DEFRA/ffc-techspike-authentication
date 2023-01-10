const config = require('../config').authConfig
const session = require('../session')
const { tokens } = require('../session/keys')

const getSignoutUrl = (request) => {
  const token = session.getToken(request, tokens.idToken)
  const signoutUrl = new URL(config.defraId.signoutUrl)
  console.log('signoutUrl', signoutUrl)
  signoutUrl.searchParams.append('post_logout_redirect_uri', config.defraId.signoutRedirectUrl)
  signoutUrl.searchParams.append('id_token_hint', token)

  return signoutUrl
}

const signout = async (request) => {
  const cookieAuth = request.cookieAuth
  cookieAuth.clear()
  session.clear(request)
}

module.exports = {
  getSignoutUrl,
  signout
}
