const getUser = (request) => {
  return {
    username: request.auth.credentials.account
  }
}

module.exports = getUser
