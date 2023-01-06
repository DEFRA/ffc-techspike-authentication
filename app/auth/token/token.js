const axios = require('axios')
const config = require('../../config').authConfig

const retrieveToken = async (request, data) => {
  const url = config.defraId.authority + '/b2c_1a_signupsigninsfi/oauth2/v2.0/token'
  const options = {
    method: 'post',
    url,
    port: 443,
    headers: {
      ...data.getHeaders()
    },
    data
  }

  return axios(options)
}

module.exports = retrieveToken
