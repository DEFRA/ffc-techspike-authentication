const routes = [].concat(
  require('../routes/assets'),
  require('../routes/index'),
  require('../routes/auth-flow'),
  require('../routes/implicit-flow'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/auth')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
