const { getSignoutUrl, signout } = require('./signout')
const getAuthenticationUrl = require('./authentication-url')
const authenticate = require('./authenticate')

module.exports = {
  getAuthenticationUrl,
  authenticate,
  getSignoutUrl,
  signout
}
