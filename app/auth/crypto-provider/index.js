const crypto = require('crypto')
const session = require('../../session')
const { pkcecodes } = require('../../session/keys')
const base64URLEncode = require('./base-64-url-encode')
const sha256 = require('./sha-256')

const createCryptoProvider = (request) => {
  const verifier = base64URLEncode(crypto.randomBytes(32))
  const challenge = base64URLEncode(sha256(verifier))

  session.setPkcecodes(request, pkcecodes.verifier, verifier)

  return challenge
}

const getVerifier = (request) => {
  return session.getPkcecodes(request, pkcecodes.verifier)
}

module.exports = {
  createCryptoProvider,
  getVerifier
}
