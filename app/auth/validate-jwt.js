const axios = require('axios')
const jwktopem = require('jwk-to-pem')
const jwt = require('jsonwebtoken')
const decodeToken = require('./decode-jwt')
const trustedIssuers = require('./trusted-issuers')
const config = require('../config').authConfig

const retrieveKey = async () => {
  const response = await axios.get(`${config.defraId.authority}/discovery/v2.0/keys?p=b2c_1a_signupsignin`)
  return response.data.keys[0]
}

const validateJwt = async (token) => {
  const decodedToken = decodeToken(token)

  if (Object.keys(decodedToken).length === 0) {
    console.log('Token decode failed.')
    return false
  }

  if (!trustedIssuers.includes(decodedToken.iss)) {
    console.log('Token issuer not trusted.')
    return false
  }

  const jwk = await retrieveKey()
  const publicKey = jwktopem(jwk)
  const decoded = await jwt.verify(token, publicKey)

  if (!decoded) {
    console.log('Token is invalid')
    return false
  }

  return true
}

module.exports = validateJwt
