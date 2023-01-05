const axios = require('axios')
const config = require('../config').authConfig
const session = require('../session')
const { tokens } = require('../session/keys')
const { createCryptoProvider } = require('./crypto-provider')
const parseRole = require('../lib/parse-role')
const decodeJwt = require('./decode-jwt')
const { expiryToISODate } = require('./token-expiry')
const validateJwt = require('./validate-jwt')
const { generateState, stateIsValid } = require('./state')
const { generateNonce, nonceIsValid } = require('./nonce')
const { buildRefreshFormData, buildAuthFormData, buildSignoutFormData } = require('./parameters')

const getAuthenticationUrl = (request, pkce = true) => {
  const authUrl = new URL(`${config.defraId.authority}/oauth2/v2.0/authorize`)
  authUrl.searchParams.append('p', 'B2C_1A_SIGNUPSIGNINSFI')
  authUrl.searchParams.append('client_id', config.defraId.clientId)
  authUrl.searchParams.append('nonce', generateNonce(request))
  authUrl.searchParams.append('redirect_uri', config.defraId.redirectUrl)
  authUrl.searchParams.append('scope', config.defraId.scope)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('prompt', 'login')
  authUrl.searchParams.append('serviceId', config.serviceId)
  authUrl.searchParams.append('state', generateState(request))

  if (pkce) {
    const { challenge } = createCryptoProvider(request)
    authUrl.searchParams.append('code_challenge', challenge)
    authUrl.searchParams.append('code_challenge_method', 'S256')
  }

  return authUrl
}

const getToken = async (request, data, url = config.defraId.authority + '/b2c_1a_signupsigninsfi/oauth2/v2.0/token') => {
  const options = {
    method: 'post',
    url,
    port: 443,
    headers: {
      ...data.getHeaders()
    },
    data
  }

  return axios(options)
}

const setCookieAuth = (request, accessToken) => {
  const cookieAuth = request.cookieAuth
  const parseAccessToken = decodeJwt(accessToken)

  const roles = parseRole(parseAccessToken.roles)

  cookieAuth.set({
    scope: roles.roleNames,
    account: { email: parseAccessToken.email }
  })
}

const setAuthTokens = async (request, response) => {
  try {
    const accessToken = response.data.access_token
    const isTokenValid = await validateJwt(accessToken)

    if (isTokenValid) {
      const idToken = response.data.id_token

      if (!nonceIsValid(request, idToken)) {
        console.log('Nonce returned does not match original nonce.')
        return false
      }

      session.clear(request)
      session.setToken(request, tokens.accessToken, accessToken)

      const tokenExpiry = expiryToISODate(response.data.expires_in)
      session.setToken(request, tokens.tokenExpiry, tokenExpiry)

      session.setToken(request, tokens.idToken, idToken)

      const refreshToken = response.data.refresh_token
      session.setToken(request, tokens.refreshToken, refreshToken)
      setCookieAuth(request, accessToken)

      return true
    }
  } catch (err) {
    console.log('Error validating token: ', err)
    if (session.getToken(request, tokens.idToken)) {
      signout(request)
    }
  }

  return false
}

const authenticate = async (request, refresh = false) => {
  if (!request.query.error) {
    if (!stateIsValid(request) && !refresh) {
      console.log('State returned does not match original state.')
      return false
    }

    const data = refresh ? buildRefreshFormData(request) : buildAuthFormData(request)
    const response = await getToken(request, data)

    return setAuthTokens(request, response)
  } else {
    console.log('Error returned from authentication request: ', request.query.error_description)
  }

  return false
}

const signout = async (request) => {
  const data = buildSignoutFormData(request)
  const signoutEndpoint = config.defraId.signoutUrl

  await getToken(request, data, signoutEndpoint)

  const cookieAuth = request.cookieAuth
  cookieAuth.clear()
  console.log('Signed out')

  session.clear(request)
}

module.exports = {
  getAuthenticationUrl,
  authenticate,
  signout
}
