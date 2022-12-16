const config = require('./config').authConfig
const msal = require('@azure/msal-node')
const session = require('./session')
const { pkcecodes } = require('./session/keys')

const confidentialClientConfig = {
  auth: config.defraId,
  system: {
    loggerOptions: {
      loggerCallback (loglevel, message, containsPii) {
        console.log(message)
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose
    }
  }
}

const confidentialClientApplication = new msal.ConfidentialClientApplication(confidentialClientConfig)

const authCodeRequest = {
  redirectUri: confidentialClientConfig.auth.redirectUrl
}

const tokenRequest = {
  redirectUri: confidentialClientConfig.auth.redirectUrl
}

const createCryptoProvider = async (request) => {
  const cryptoProvider = new msal.CryptoProvider()
  const { verifier, challenge } = await cryptoProvider.generatePkceCodes()

  session.setPkcecodes(request, pkcecodes.verifier, verifier)
  session.setPkcecodes(request, pkcecodes.challenge, challenge)

  return { verifier, challenge }
}

const getAuthenticationUrl = async (request) => {
  const { challenge } = await createCryptoProvider(request)

  authCodeRequest.authority = `${confidentialClientConfig.auth.authority}/oauth2/v2.0/authorize`
  authCodeRequest.scopes = ['openid 83d2b160-74ce-4356-9709-3f8da7868e35']
  authCodeRequest.prompt = 'login'
  authCodeRequest.codeChallenge = challenge
  authCodeRequest.codeChallengeMethod = 'S256'
  authCodeRequest.nonce = '12345'

  tokenRequest.authority = `${confidentialClientConfig.auth.authority}/oauth2/v2.0/token`

  console.log('Auth code request', authCodeRequest)

  let authUrl = await confidentialClientApplication.getAuthCodeUrl(authCodeRequest)
  authUrl = `${authUrl}&p=b2c_1a_signupsigninsfi&serviceId=${config.serviceId}`

  return authUrl
}

const authenticate = async (request) => {
  const redirectCode = request.query.code
  const cookieAuth = request.cookieAuth
  const clientInfo = request.query.client_info
  const verifier = session.getPkcecodes(request, pkcecodes.verifier)

  tokenRequest.code = redirectCode
  tokenRequest.scopes = ['openid 83d2b160-74ce-4356-9709-3f8da7868e35']
  tokenRequest.grantType = 'authorization_code'
  tokenRequest.codeVerifier = verifier
  tokenRequest.clientInfo = clientInfo

  console.log('Token request', tokenRequest)

  const token = await confidentialClientApplication.acquireTokenByCode(tokenRequest)

  cookieAuth.set({
    scope: token.idTokenClaims.roles,
    account: token.account
  })
}

const refresh = async (account, cookieAuth, forceRefresh = true) => {
  const token = await confidentialClientApplication.acquireTokenSilent({
    account,
    forceRefresh
  })

  cookieAuth.set({
    scope: token.idTokenClaims.roles,
    account: token.account
  })

  return token.idTokenClaims.roles
}

const logout = async (account) => {
  try {
    await confidentialClientApplication.getTokenCache().removeAccount(account)
  } catch (err) {
    console.error('Unable to end session', err)
  }
}

module.exports = {
  getAuthenticationUrl,
  authenticate,
  refresh,
  logout
}
