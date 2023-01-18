const wreck = require('@hapi/wreck')
const config = require('../config')
const session = require('../session')
const { tokens, person } = require('../session/keys')

const get = async (request) => {
  const token = session.getToken(request, tokens.accessToken)
  const crn = session.getPerson(request, person.crn)
  const response = await wreck.get(`${config.proxyUrl}/extapi/person/5020221/summary`,
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
