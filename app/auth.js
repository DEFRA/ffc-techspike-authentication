const config = require('./config').authConfig
const msal = require('@azure/msal-node')

const confidentialClientConfig = {
  auth: config.defraId,
  extraQueryParameters: {
    prompt: 'login'
  },
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

const getAuthenticationUrl = async () => {
  console.log('Fetching Authorization code')
  authCodeRequest.authority = `${confidentialClientConfig.auth.authority}/oauth2/v2.0/authorize`
  authCodeRequest.scopes = ['openid']
  authCodeRequest.prompt = 'login'
  tokenRequest.authority = `${confidentialClientConfig.auth.authority}/oauth2/v2.0/token`

  let authUrl = await confidentialClientApplication.getAuthCodeUrl(authCodeRequest)
  authUrl = `${authUrl}&p=b2c_1a_signupsigninsfi&serviceId=${config.serviceId}`

  return authUrl
}

const authenticate = async (redirectCode, cookieAuth) => {
  tokenRequest.code = redirectCode
  tokenRequest.scopes = ['openid']

  console.log('Fetching token', tokenRequest.code)
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
