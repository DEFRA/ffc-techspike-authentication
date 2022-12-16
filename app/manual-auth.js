const config = require('./config').authConfig
const axios = require('axios')
const FormData = require('form-data')
const session = require('./session')
const { tokens } = require('./session/keys')

const getAuthenticationUrl = () => {
  const authUrl = new URL(`${config.defraId.authority}/oauth2/v2.0/authorize`)
  authUrl.searchParams.append('p', 'B2C_1A_SIGNUPSIGNINSFI')
  authUrl.searchParams.append('client_id', config.defraId.clientId)
  authUrl.searchParams.append('nonce', 'defaultNonce')
  authUrl.searchParams.append('redirect_uri', config.defraId.redirectUrl)
  authUrl.searchParams.append('scope', 'openid')
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('prompt', 'login')
  authUrl.searchParams.append('serviceId', config.serviceId)
  return authUrl
}

const buildFormData = (request) => {
  const redirectCode = request.query.code
  const data = new FormData()
  data.append('client_id', config.defraId.clientId)
  data.append('client_secret', config.defraId.clientSecret)
  data.append('scope', 'openid 83d2b160-74ce-4356-9709-3f8da7868e35')
  data.append('code', redirectCode)
  data.append('grant_type', 'authorization_code')

  return data
}

const getToken = async (request) => {
  const data = buildFormData(request)

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

const authenticate = async (request) => {
  const cookieAuth = request.cookieAuth
  const response = await getToken(request)

  const accessToken = response.data.access_token
  session.setToken(request, tokens.accessToken, accessToken)

  const idToken = response.data.id_token
  session.setToken(request, tokens.idToken, idToken)

  cookieAuth.set({
    scope: accessToken.roles,
    account: accessToken.email
  })
}

module.exports = {
  getAuthenticationUrl,
  authenticate
}
