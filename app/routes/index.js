module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: false,
    handler: async (request, h) => {
      return h.view('index').code(200)
    }
  }
}
