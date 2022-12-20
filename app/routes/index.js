module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: false,
    handler: async (request, h) => {
      console.log(request.auth)
      console.log(request.yar)
      return h.view('index').code(200)
    }
  }
}
