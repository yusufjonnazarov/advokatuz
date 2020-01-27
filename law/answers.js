'use strict'

const fp = require('fastify-plugin')
const mongoose =  require('mongoose')
const TokenGenerator = require('uuid-token-generator')
// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(function (fastify, opts, next) {

	fastify.post('/answer/create', (request, reply) => {
		fastify.oauth(request, reply, (user) => {
			if(user.role == 'lawyer') {
				fastify.Questions.find({
					_id: request.body.question_id
				}, (_, question) => {
					if(question) {
						// request.body.question_id = fastify.ObjectId(question._id)
						request.body.lawyer_id = user._id
						var answer = new fastify.Answers(request.body)
						answer.save((err, ans) => {
							if(ans) {
								reply.ok(ans)
							}
							else {
								reply.error('Error on saving answer')
							}
						})
					}
					else {
						reply.fourorfour('Question')
					}
				})
			}
			else {
				reply.error('Error')
			}
		})
	})

	fastify.post('/answer/search', (request, reply) => {
		fastify.oauth(request, reply, (user) => {
			var query = request.body
			if(query.question_id) {
				query.question_id = fastify.ObjectId(query.question_id)
			}
			else {
				delete query.question_id
			}
			if(query.lawyer_id) {
				query.lawyer_id = fastify.ObjectId(query.lawyer_id)
			}
			else {
				delete query.lawyer_id
			}

			fastify.Answers.find(query, (err, answers) => {
				if(answers) {
					reply.ok(answers)
				}
				else {
					reply.fourorfour('answer')
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
