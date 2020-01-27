'use strict'
const TokenGenerator = require('uuid-token-generator')

module.exports = function (fastify, opts, next) {
  
  fastify.get('/', function (request, reply) {
    reply.send("Working!")
  })

  fastify.post('/register', (request ,reply) => {
  	fastify.Users.findOne({
  		phone_number: request.body.phone_number
  	}, (err, user) => {
  		if(user) {
  			reply.allready()
  		}
  		else {
  			if(request.body.role == 'lawyer') {

  			}
  			var user = new fastify.Users(request.body)
  			user.save((err) => {
  				if(err) {
  					reply.error('Error on saving')
  				}
  				else {
  					reply.ok()
  				}
  			})
  		}
  	})
  })

  fastify.post('/login', (request, reply) => {
  	fastify.Users.findOne({
  		phone_number: request.body.phone_number
  	}, (err, user) => {
  		if(user) {
  			if(user.password === request.body.password) {
  				user.token = (new TokenGenerator()).generate()
  				fastify.Users.updateOne({
  					_id: user._id
  				}, {
  					$set: {
  						token: user.token
  					}
  				}, (err) => {
  					if(err) {
  						reply.error('Error on updating')
  					}
  					else {
  						reply.ok(user)
  					}
  				})
  			}
  			else {
  				reply.unauthorized()
  			}
  		}
  		else {
  			reply.fourorfour('user')
  		}
  	})
  })

  next()
}

// If you prefer async/await, use the following
//
// module.exports = async function (fastify, opts) {
//   fastify.get('/', async function (request, reply) {
//     return { root: true }
//   })
// }
