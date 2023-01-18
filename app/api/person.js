const { get } = require('./base')
const session = require('../session')
const { person } = require('../session/keys')

const getPersonSummary = async (request) => {
  const crn = session.getPerson(request, person.crn)
  const response = await get('/extapi/person/3337243/summary', request, { crn })
  return response._data
}

module.exports = getPersonSummary
