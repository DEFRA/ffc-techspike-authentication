const decodeJwt = require('../auth/token/jwt/decode-jwt')

const entries = {
  pkcecodes: 'pkcecodes',
  tokens: 'tokens',
  person: 'person'
}

const set = (request, entryKey, key, value) => {
  const entryValue = request.yar?.get(entryKey) || {}
  entryValue[key] = typeof (value) === 'string' ? value.trim() : value
  request.yar.set(entryKey, entryValue)
}

const get = (request, entryKey, key) => {
  return key ? request.yar?.get(entryKey)?.[key] : request.yar?.get(entryKey)
}

const clear = (request) => {
  request.yar.clear(entries.pkcecodes)
  request.yar.clear(entries.tokens)
  request.yar.clear(entries.person)
}

const setToken = (request, key, value) => {
  set(request, entries.tokens, key, value)
}

const getToken = (request, key, decode = false) => {
  const token = get(request, entries.tokens, key)
  if (decode) {
    return decodeJwt(token)
  }
  return token
}

const setPkcecodes = (request, key, value) => {
  set(request, entries.pkcecodes, key, value)
}

const getPkcecodes = (request, key) => {
  return get(request, entries.pkcecodes, key)
}

const setPerson = (request, key, value) => {
  set(request, entries.person, key, value)
}

const getPerson = (request, key) => {
  return get(request, entries.person, key)
}

module.exports = {
  getPkcecodes,
  setPkcecodes,
  getToken,
  setToken,
  getPerson,
  setPerson,
  clear
}
