const session = require('../session')
const { tokens } = require('../session/keys')
const { ownerSoleTrader } = require('../auth/permissions')

module.exports = {
  method: 'GET',
  path: '/user-details',
  options: {
    auth: { scope: [ownerSoleTrader] },
    handler: async (request, h) => {
      const token = session.getToken(request, tokens.idToken, true)
      const tokenExpiry = session.getToken(request, tokens.tokenExpiry)
      return h.view('user-details', { token, tokenExpiry })
    }
  }
}
