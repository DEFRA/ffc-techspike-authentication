const { getPersonSummary, getPersonOrgSummary } = require('./person')
const { getOrganisationAuthorisation, organisationHasPermission, getOrganisationCphNumbers, getOrganisation, organisationIsEligible } = require('./organisation')

module.exports = {
  getPersonSummary,
  getPersonOrgSummary,
  getOrganisationAuthorisation,
  organisationHasPermission,
  getOrganisationCphNumbers,
  getOrganisation,
  organisationIsEligible
}
