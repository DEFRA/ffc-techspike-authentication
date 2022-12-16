const config = require('../config').authConfig

module.exports = {
  method: 'GET',
  path: '/implicit-flow',
  options: {
    auth: false,
    handler: async (request, h) => {
      try {
        const authUrl = `${config.defraId.authority}/oauth2/v2.0/authorize?p=b2c_1a_signupsigninsfi&client_id=${config.defraId.clientId}&nonce=defaultNonce&redirect_uri=${config.defraId.redirectUrl}&scope=openid&response_type=id_token&serviceId=${config.serviceId}&aal=1&forceMFA=true&prompt=login`
        return h.redirect(authUrl)
      } catch (err) {
        console.log('Error authenticating', err)
      }
    }
  }
}
