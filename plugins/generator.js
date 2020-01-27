'use strict'

const fp = require('fastify-plugin')
const mongoose =  require('mongoose')
const TokenGenerator = require('uuid-token-generator')
// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope
mongoose.connect('mongodb://localhost:27017/lawyerdb', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

module.exports = fp(function (fastify, opts, next) {

  fastify.decorate('db', mongoose)
  fastify.decorate('model', function(name, schema) {
    return mongoose.model(name, new mongoose.Schema(schema))
  })

  fastify.decorate('ObjectId', require('mongodb').ObjectID)

  next()
})

// If you prefer async/await, use the following
//
// module.exports = fp(async function (fastify, opts) {
//   fastify.decorate('someSupport', function () {
//     return 'hugs'
//   })
// })
