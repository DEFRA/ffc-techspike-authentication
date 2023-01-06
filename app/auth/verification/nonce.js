const { v4: uuidv4 } = require('uuid')
const session = require('../../session')
const { tokens } = require('../../session/keys')
const decodeJwt = require('../token/jwt/decode-jwt')

const generateNonce = (request) => {
  const nonce = uuidv4()
  session.setToken(request, tokens.nonce, nonce)
  return nonce
}

const nonceIsValid = (request, idToken) => {
  const nonce = session.getToken(request, tokens.nonce)

  if (!nonce) {
    return false
  }
  const savedNonce = decodeJwt(idToken)
  return nonce === savedNonce.nonce
}

module.exports = {
  generateNonce,
  nonceIsValid
}
