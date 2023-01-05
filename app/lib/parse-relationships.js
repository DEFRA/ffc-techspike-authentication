module.exports = function parseRelationships (relationshipsToParse) {
  const relationships = relationshipsToParse.map(x => {
    const parseReleationships = x.split(':')
    return {
      relationshipId: parseReleationships[0],
      organisationId: parseReleationships[1],
      organisationName: parseReleationships[2],
      organisationLoa: parseReleationships[3],
      relationship: parseReleationships[4],
      relationshipLoa: parseReleationships[5]
    }
  })

  return { relationships }
}
