const session = require('../session')
const { tokens } = require('../session/keys')
const { ownerSoleTrader, keyContact } = require('../auth/constants/roles')
// const { get } = require('../api/base')

module.exports = {
  method: 'GET',
  path: '/user-details',
  options: {
    auth: { scope: [ownerSoleTrader, keyContact] },
    handler: async (request, h) => {
      const token = session.getToken(request, tokens.idToken, true)
      const accessToken = session.getToken(request, tokens.accessToken)
      const idToken = session.getToken(request, tokens.idToken)
      const tokenExpiry = session.getToken(request, tokens.tokenExpiry)
      // const ch = await get(request)
      return h.view('user-details', { token, tokenExpiry, accessToken, idToken })
    }
  }
}
