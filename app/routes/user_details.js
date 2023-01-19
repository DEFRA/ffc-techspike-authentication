const session = require('../session')
const { tokens } = require('../session/keys')
const { ownerSoleTrader, keyContact, agent } = require('../auth/constants/roles')
const { getPersonSummary, organisationIsEligible } = require('../api')

module.exports = {
  method: 'GET',
  path: '/user-details',
  options: {
    auth: { scope: [ownerSoleTrader, keyContact, agent] },
    handler: async (request, h) => {
      const token = session.getToken(request, tokens.idToken, true)
      const accessToken = session.getToken(request, tokens.accessToken)
      const idToken = session.getToken(request, tokens.idToken)
      const tokenExpiry = session.getToken(request, tokens.tokenExpiry)
      const personSummary = await getPersonSummary(request)
      const organisationSummary = await organisationIsEligible(request)
      return h.view('user-details', { token, tokenExpiry, accessToken, idToken, personSummary, organisationSummary })
    }
  }
}
