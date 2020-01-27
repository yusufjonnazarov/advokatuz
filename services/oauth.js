'use strict'

const fp = require('fastify-plugin')
module.exports = fp(function (fastify, opts, next) {
  
  fastify.decorate('oauth', (request, reply, then) => {
    fastify.Users.findOne({
      token: request.headers['authorization']
    }, (_, user) => {
      if(user && request.headers['authorization'] != undefined) {
        then(user)
      }
      else {
        reply.unauthorized()
      }
    })
  })

  next()
})

// If you prefer async/await, use the following
//
// module.exports = async function (fastify, opts) {
//   fastify.get('/', async function (request, reply) {
//     return { root: true }
//   })
// }
