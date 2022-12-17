const config = require('../config').authConfig
const axios = require('axios')
const FormData = require('form-data')
const session = require('../session')
const { tokens } = require('../session/keys')
const { createCryptoProvider, getVerifier } = require('./crypto-provider')
const parseRole = require('../lib/parse-role')
const decodeJwt = require('./decode-jwt')
const { expiryToISODate } = require('./token-expiry')
const validateJwt = require('./validate-jwt')

const getAuthenticationUrl = (request, pkce = false) => {
  const authUrl = new URL(`${config.defraId.authority}/oauth2/v2.0/authorize`)
  authUrl.searchParams.append('p', 'B2C_1A_SIGNUPSIGNINSFI')
  authUrl.searchParams.append('client_id', config.defraId.clientId)
  authUrl.searchParams.append('nonce', 'defaultNonce')
  authUrl.searchParams.append('redirect_uri', config.defraId.redirectUrl)
  authUrl.searchParams.append('scope', 'openid')
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('prompt', 'login')
  authUrl.searchParams.append('serviceId', config.serviceId)
  authUrl.searchParams.append('state', '123456789')

  if (pkce) {
    const { challenge } = createCryptoProvider(request)
    authUrl.searchParams.append('code_challenge', challenge)
    authUrl.searchParams.append('code_challenge_method', 'S256')
  }

  return authUrl
}

const buildAuthFormData = (request, pkce = false) => {
  const redirectCode = request.query.code
  const data = new FormData()
  data.append('client_id', config.defraId.clientId)
  data.append('client_secret', config.defraId.clientSecret)
  data.append('scope', 'openid 83d2b160-74ce-4356-9709-3f8da7868e35')
  data.append('code', redirectCode)
  data.append('grant_type', 'authorization_code')
  data.append('redirect_uri', config.defraId.redirectUrl)

  if (pkce) {
    data.append('code_verifier', getVerifier(request))
  }

  return data
}

const buildRefreshFormData = (request) => {
  const refreshToken = session.getToken(request, tokens.idToken, true)
  const data = new FormData()
  data.append('client_id', config.defraId.clientId)
  data.append('client_secret', config.defraId.clientSecret)
  data.append('scope', 'openid 83d2b160-74ce-4356-9709-3f8da7868e35')
  data.append('refresh_token', refreshToken)
  data.append('grant_type', 'refresh_token')
  data.append('redirect_uri', config.defraId.redirectUrl)

  return data
}

const getToken = async (request, data) => {
  const options = {
    method: 'post',
    url: config.defraId.authority + '/b2c_1a_signupsigninsfi/oauth2/v2.0/token',
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
    account: parseAccessToken.email
  })
}

const authenticate = async (request, refresh = false) => {
  const data = refresh ? buildRefreshFormData(request) : buildAuthFormData(request)
  const response = await getToken(request, data)

  const accessToken = response.data.access_token
  const isTokenValid = await validateJwt(accessToken)

  if (isTokenValid) {
    session.setToken(request, tokens.accessToken, accessToken)

    const tokenExpiry = expiryToISODate(response.data.expires_in)
    session.setToken(request, tokens.tokenExpiry, tokenExpiry)

    const idToken = response.data.id_token
    session.setToken(request, tokens.idToken, idToken)

    setCookieAuth(request, accessToken)
  }
}

module.exports = {
  getAuthenticationUrl,
  authenticate
}
