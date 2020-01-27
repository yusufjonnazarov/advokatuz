'use strict'

const fp = require('fastify-plugin')
const mongoose =  require('mongoose')
const TokenGenerator = require('uuid-token-generator')
// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(function (fastify, opts, next) {
	fastify.post('/question/create', (request, reply) => {
		fastify.oauth(request, reply, (user) => {
			request.body.citizen_id = user._id
			var question = new fastify.Questions(request.body);
			question.save((err, ques) => {
				if(err) {
					reply.error('Error on saving question')
				}
				else {
					reply.ok(ques)
				}
			})
		})
	})

	fastify.post('/question/search/:type', (request, reply) => {
		fastify.oauth(request, reply, (user) => {
			var query = {
				type: 'public'
			}
			if(request.params.type == 'mine') {
				query = {
					citizen_id: fastify.ObjectId(user._id)
				}
			}
			fastify.Questions.aggregate([
				{
					$match: query
				},
				{
					$lookup: {
						from: 'answers',
						localField: '_id',
						foreignField: 'question_id',
						as: 'answers'
					}
				}
			], (_, questions) => {
				if(questions) {
					reply.ok(questions)
				}
				else {
					reply.error('Error on searching')
				}
			})
		})
	})

  	next()
})

// If you prefer async/await, use the following
//
// module.exports = fp(async function (fastify, opts) {
//   fastify.decorate('someSupport', function () {
//     return 'hugs'
//   })
// })
