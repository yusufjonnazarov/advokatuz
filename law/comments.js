'use strict'

const fp = require('fastify-plugin')
const mongoose =  require('mongoose')
const TokenGenerator = require('uuid-token-generator')
// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(function (fastify, opts, next) {

	fastify.post('/comment/create', (request, reply) => {
		fastify.oauth(request, reply, (user)=> {
			fastify.Answers.findOne({
				_id: request.body.leaving_id
			}, (_, answer) => {
				if(answer) {
					if(request.body.rank) {
						answer.rank = (answer.rank * answer.count_rank + request.body.rank)/(answer.count_rank + 1)
						answer.count_rank ++;
					}
					fastify.Answers.updateOne({
						_id: answer._id
					}, {
						$set: answer
					}, (err, res) => {
						if(err) {
							reply.error('Error on creating')
						}
						else {
							var comment = new fastify.Comments(request.body)
							comment.save((err) => {
								if(err) {
									reply.error('Error on saving')
								}
								else {
									reply.ok()
								}
							})
							fastify.Users.findOne({
								_id: answer.lawyer_id
							}, (_, lawyer) => {
								if(lawyer) {
									if(request.body.rank) {
										lawyer.rank = (lawyer.rank * lawyer.count_rank + request.body.rank)/(lawyer.count_rank + 1)
										lawyer.count_rank ++;
										fastify.Users.updateOne({
											_id: lawyer
										}, {
											$set: lawyer
										}, () => {
											console.log('Done!')
										})
									}
								}
							})
						}
					})
				}
				else {
					fastify.Users.findOne({
						_id: request.body.leaving_id
					}, (_, user) => {
						if(user == undefined) {
							user = {}
						}
						if(user.role == 'lawyer') {
							if(request.body.rank) {
								user.rank = (user.rank * user.count_rank + request.body.rank)/(user.count_rank + 1)
								user.count_rank ++;
							}
							fastify.Users.updateOne({
								_id: user._id
							}, {
								$set: user
							}, (err) => {
								if(err){
									reply.error('Error on saving')
								}
								else {
									var comment = new fastify.Comments(request.body)
									comment.save((err) => {
										if(err) {
											reply.error('Error on saving')
										}
										else {
											reply.ok()
										}
									})
								}
							})
						}
						else {
							fastify.Questions.findOne({
								_id: request.body.leaving_id
							}, (_, question) => {
								if(question) {
									var comment = new fastify.Comments(request.body)
									comment.save((err) => {
										if(err) {
											reply.error('Error on saving')
										}
										else {
											reply.ok()
										}
									})	
								}
								else {
									reply.fourorfour('Anything')
								}
							})
						}
					})
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
