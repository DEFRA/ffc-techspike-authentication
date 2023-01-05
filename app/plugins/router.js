const routes = [].concat(
  require('../routes/assets'),
  require('../routes/index'),
  require('../routes/login'),
  require('../routes/user_details'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/auth'),
  require('../routes/logout')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
