const { v4: uuidv4 } = require('uuid')
const session = require('../session')
const { tokens } = require('../session/keys')

const generateState = (request) => {
  const state = uuidv4()
  session.setToken(request, tokens.state, state)
  return state
}

const stateIsValid = (request) => {
  const state = request.query.state
  const savedState = session.getToken(request, tokens.state)
  console.log(state, savedState)
  return state === savedState
}

module.exports = {
  generateState,
  stateIsValid
}
