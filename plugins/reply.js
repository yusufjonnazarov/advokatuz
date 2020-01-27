const fp = require('fastify-plugin')

module.exports = fp((instance, _, next) => {

  instance.decorateReply('ok', function (data = undefined) {
    var response = {
      statusCode: 200,
      error: 'Ok',
      message: 'Success'
    }
    if (data) {
      response.data = data
    }
    this.send(response)
  })

  instance.decorateReply('error', function (name) {
    var response = {
      statusCode: 422,
      error: name,
      message: 'Error: ' + name
    }
    this.send(response)
  })

  instance.decorateReply('allready', () => {
    this.send({
      statusCode: 411,
      message: 'Allready exist'
    })
  })

  instance.decorateReply('fourorfour', function (name = 'Object') {
    var response = {
      statusCode: 404,
      error: name,
      message: name + ' not found'
    }
    this.send(response)
  })

  instance.decorateReply('unauthorized', () => {
    this.status(401).send('Unauthorized')
  })

  next()
})