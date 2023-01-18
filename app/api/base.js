const wreck = require('@hapi/wreck')
const session = require('../session')
const { tokens, person } = require('../session/keys')

const get = async (request) => {
  const token = session.getToken(request, tokens.accessToken)
  const crn = session.getPerson(request, person.crn)
  const response = await wreck.get('https://ffc-rpa-api-gateway.ffc.snd.azure.defra.cloud/extapi/person/5020221/summary',
    {
      headers: { Authorization: token, crn },
      json: true,
      rejectUnauthorized: false
    })

  return response?.payload?._data
}

module.exports = {
  get
}
