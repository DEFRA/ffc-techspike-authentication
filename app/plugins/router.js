const routes = [].concat(
  require('../routes/assets'),
  require('../routes/index'),
  require('../routes/signin'),
  require('../routes/user_details'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/auth'),
  require('../routes/signout')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
