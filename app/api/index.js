const getPersonSummary = require('./person')
const { getOrganisationAuthorisation, organisationHasPermission, getOrganisationCphNumbers, getOrganisation, organisationIsEligible } = require('./organisation')

module.exports = {
  getPersonSummary,
  getOrganisationAuthorisation,
  organisationHasPermission,
  getOrganisationCphNumbers,
  getOrganisation,
  organisationIsEligible
}
