const { get } = require('./base')
const session = require('../session')
const { person } = require('../session/keys')

const getPersonSummary = async (request) => {
  const crn = session.getPerson(request, person.crn)
  const response = await get('/extapi/person/3337243/summary', request, { crn })
  return response._data
}

const getPersonOrgSummary = async (request, personId) => {
  const crn = session.getPerson(request, person.crn)
  const response = await get(`/extapi/organisation/person/${personId}/summary?order=asc&search=&sort-by=name&pagesize=20&page=1`, request, { crn })
  return response._data
}

module.exports = {
  getPersonSummary,
  getPersonOrgSummary
}
