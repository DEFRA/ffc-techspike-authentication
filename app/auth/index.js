const { getSignoutUrl, signout } = require('./signout')
const getAuthenticationUrl = require('./authorize')
const authenticate = require('./authenticate')

module.exports = {
  getAuthenticationUrl,
  authenticate,
  getSignoutUrl,
  signout
}
