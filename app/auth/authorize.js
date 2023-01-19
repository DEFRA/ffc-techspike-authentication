const config = require('../config').authConfig
const { createCryptoProvider } = require('./crypto-provider')
const { generateNonce, generateState } = require('./verification')

const getAuthenticationUrl = (request, pkce = true) => {
  const authUrl = new URL(`${config.defraId.authority}/oauth2/v2.0/authorize`)
  authUrl.searchParams.append('p', 'B2C_1A_SIGNUPSIGNINSFI')
  authUrl.searchParams.append('client_id', config.defraId.clientId)
  authUrl.searchParams.append('nonce', generateNonce(request))
  authUrl.searchParams.append('redirect_uri', config.defraId.redirectUrl)
  authUrl.searchParams.append('scope', config.defraId.scope)
  authUrl.searchParams.append('response_type', 'code')
  // authUrl.searchParams.append('prompt', 'login')
  authUrl.searchParams.append('serviceId', config.serviceId)
  authUrl.searchParams.append('state', generateState(request))
  authUrl.searchParams.append('forceReselection', true)

  if (pkce) {
    const challenge = createCryptoProvider(request)
    authUrl.searchParams.append('code_challenge', challenge)
    authUrl.searchParams.append('code_challenge_method', 'S256')
  }

  return authUrl
}

module.exports = getAuthenticationUrl
