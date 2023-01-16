const wreck = require('@hapi/wreck')
const session = require('../session')
const { tokens } = require('../session/keys')

const get = async (request) => {
  const token = session.getToken(request, tokens.accessToken)
  return wreck.get('https://ffc-rpa-api-gateway.ffc.snd.azure.defra.cloud/extapi/person/5020221/summary',
    {
      headers: { Authorization: token, crn: 1100202218 },
      json: true,
      rejectUnauthorized: false
    })
}

module.exports = {
  get
}
