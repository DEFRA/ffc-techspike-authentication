const getUser = require('../auth/get-user')
const mapAuth = require('../auth/map-auth')
const { getSignoutUrl } = require('../auth')

module.exports = {
  plugin: {
    name: 'view-context',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const statusCode = request.response.statusCode
        if (request.response.variety === 'view' && statusCode !== 404 && statusCode !== 500 && request.response.source.context) {
          request.response.source.context.auth = mapAuth(request)
          request.response.source.context.user = getUser(request)
          request.response.source.context.signout = getSignoutUrl(request)
        }
        return h.continue
      })
    }
  }
}
