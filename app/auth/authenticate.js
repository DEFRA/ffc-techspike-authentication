const session = require('../session')
const { tokens } = require('../session/keys')
const { stateIsValid } = require('./verification/state')
const { nonceIsValid } = require('./verification/nonce')
const parseRole = require('./lib/parse-role')
const { retrieveToken, validateJwt, expiryToISODate, decodeJwt } = require('./token')

const setCookieAuth = (request, accessToken) => {
  const cookieAuth = request.cookieAuth
  const parseAccessToken = decodeJwt(accessToken)

  const { roleNames } = parseRole(parseAccessToken.roles)

  cookieAuth.set({
    scope: roleNames,
    account: { email: parseAccessToken.email, name: `${parseAccessToken.firstName} ${parseAccessToken.lastName}` }
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
  }

  return false
}

const authenticate = async (request, refresh = false) => {
  if (!request.query.error) {
    if (!stateIsValid(request) && !refresh) {
      console.log('State returned does not match original state.')
      return false
    }

    const response = await retrieveToken(request, refresh)
    return setAuthTokens(request, response)
  } else {
    console.log('Error returned from authentication request: ', request.query.error_description)
  }

  return false
}

module.exports = authenticate
