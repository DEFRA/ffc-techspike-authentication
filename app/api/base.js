const wreck = require('@hapi/wreck')
const config = require('../config')
const session = require('../session')
const { tokens } = require('../session/keys')

const get = async (url, request, headers = {}) => {
  const token = session.getToken(request, tokens.accessToken)
  headers.Authorization = token
  const response = await wreck.get(`${config.proxyUrl}${url}`,
    {
      headers,
      json: true,
      rejectUnauthorized: false
    })
  return response?.payload
}

module.exports = {
  get
}
