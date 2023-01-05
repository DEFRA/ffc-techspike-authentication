const axios = require('axios')
const config = require('../config').authConfig
const FormData = require('form-data')
const session = require('../session')
const { tokens } = require('../session/keys')
const { createCryptoProvider, getVerifier } = require('./crypto-provider')
const parseRole = require('../lib/parse-role')
const decodeJwt = require('./decode-jwt')
const { expiryToISODate } = require('./token-expiry')
const validateJwt = require('./validate-jwt')
const { generateState, stateIsValid } = require('./validate-state')

const scope = 'openid 83d2b160-74ce-4356-9709-3f8da7868e35 offline_access'

const getAuthenticationUrl = (request, pkce = true) => {
  const authUrl = new URL(`${config.defraId.authority}/oauth2/v2.0/authorize`)
  authUrl.searchParams.append('p', 'B2C_1A_SIGNUPSIGNINSFI')
  authUrl.searchParams.append('client_id', config.defraId.clientId)
  authUrl.searchParams.append('nonce', 'defaultNonce')
  authUrl.searchParams.append('redirect_uri', config.defraId.redirectUrl)
  authUrl.searchParams.append('scope', scope)
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

const buildFormData = () => {
  const data = new FormData()
  data.append('client_id', config.defraId.clientId)
  data.append('client_secret', config.defraId.clientSecret)
  data.append('scope', scope)

  return data
}

const buildAuthFormData = (request, pkce = true) => {
  const redirectCode = request.query.code
  const data = buildFormData()
  data.append('code', redirectCode)
  data.append('grant_type', 'authorization_code')
  data.append('redirect_uri', config.defraId.redirectUrl)

  if (pkce) {
    data.append('code_verifier', getVerifier(request))
  }

  return data
}

const buildRefreshFormData = (request) => {
  const refreshToken = session.getToken(request, tokens.idToken)
  const data = buildFormData()
  data.append('refresh_token', refreshToken)
  data.append('grant_type', 'refresh_token')
  data.append('redirect_uri', config.defraId.redirectUrl)

  return data
}

const buildSignoutFormData = (request) => {
  const signoutToken = session.getToken(request, tokens.idToken)
  const data = new FormData()
  data.append('post_logout_redirect_uri', 'https://localhost:3000')
  data.append('id_token_hint', signoutToken)

  return data
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
    account: parseAccessToken.email
  })
}

const authenticate = async (request, refresh = false) => {
  if (!request.query.error) {
    if (stateIsValid(request)) {
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

        const refreshToken = response.data.refresh_token
        session.setToken(request, tokens.refreshToken, refreshToken)

        setCookieAuth(request, accessToken)

        return true
      }
    } else {
      console.log('State returned does not match original state.')
    }
  } else {
    console.log('Error returned from authentication request: ', request.query.error_description)
  }

  return false
}

const signout = async (request) => {
  const data = buildSignoutFormData(request)
  const signoutEndpoint = 'https://condev5.azure.defra.cloud/idphub/b2c/b2c_1a_signupsignin/signout'
  // await getToken(request, data, signoutEndpoint)

  const cookieAuth = request.cookieAuth
  cookieAuth.clear()
  console.log('Cookie cleared')

  session.clear(request)
}

module.exports = {
  getAuthenticationUrl,
  authenticate,
  signout
}
