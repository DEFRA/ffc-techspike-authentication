const { get } = require('./base')
const session = require('../session')
const { person } = require('../session/keys')

const getOrganisationAuthorisation = async (request) => {
  const organisationId = session.getPerson(request, person.organisationId)
  const response = await get(`/extapi/SitiAgriApi/authorisation/organisation/${organisationId}/authorisation`, request)
  return response?.data
}

const permissionMatcher = (permissions, permissionToMatch) => {
  return permissions.every(value => permissionToMatch.includes(value))
}

const organisationHasPermission = async (request, permissions) => {
  const organisationAuthorisation = await getOrganisationAuthorisation(request)
  const hasPermission = organisationAuthorisation.personPrivileges.some(privilege => permissionMatcher(privilege.privilegeNames, permissions))
  return hasPermission
}

const getOrganisationCphNumbers = async (request) => {
  const organisationId = session.getPerson(request, person.organisationId)
  const response = await get(`/extapi/SitiAgriApi/cph/organisation/${organisationId}/cph-numbers`, request)
  return response?.data
}

const getOrganisation = async (request) => {
  const organisationId = session.getPerson(request, person.organisationId)
  const response = await get(`/extapi/organisation/${organisationId}`, request)
  return response?._data
}

const organisationIsEligible = async (request) => {
  let cphNumbers = []
  let organisation = {}
  const organisationPermission = await organisationHasPermission(request, ['Submit - bps', 'Full permission - business'])

  if (organisationPermission) {
    cphNumbers = await getOrganisationCphNumbers(request)
    organisation = await getOrganisation(request)
  }

  return {
    organisationPermission,
    cphNumbers,
    organisation
  }
}

module.exports = {
  getOrganisationAuthorisation,
  organisationHasPermission,
  getOrganisationCphNumbers,
  getOrganisation,
  organisationIsEligible
}
