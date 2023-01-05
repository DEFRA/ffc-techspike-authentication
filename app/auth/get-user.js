const getUser = (request) => {
  return {
    name: request.auth.credentials.account.name
  }
}

module.exports = getUser
