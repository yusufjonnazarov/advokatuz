const fp = require('fastify-plugin')
const mongoose = require('mongoose')
module.exports = fp((fastify, options, next) => {
	
	var Users = fastify.model('Users', {
		name: String,
		surname: {
			type: String,
			default: ''
		},
		phone_number: String,
		password: String,
		token: String,
		registered_time: Number,
		role: {
			type: String,
			enum: ["lawyer", "citizen"],
			default: "citizen"
		},
		experience: Number,
		count_rank: {
			type: Number,
			default: 0
		},
		rank: Number
	})
	fastify.decorate('Users', Users)

	var Questions = fastify.model("Questions", {
		citizen_id: mongoose.Schema.Types.ObjectId,
		type: {
			type: String,
			enum: ['public', 'private'],
			default: 'public'
		},
		question: String
	})
	fastify.decorate('Questions', Questions)

	var Answers = fastify.model('Answers', {
		question_id: mongoose.Schema.Types.ObjectId,
		lawyer_id: mongoose.Schema.Types.ObjectId,
		answer: String,
		count_rank: {
			type: Number,
			default: 0
		},
		rank: {
			type: Number,
			default: 0
		}
	})
	fastify.decorate('Answers', Answers)

	var Comments = fastify.model('Comments', {
		leaving_id: mongoose.Schema.Types.ObjectId,
		comment: String,
		rank: Number
	})
	fastify.decorate('Comments', Comments)

	next()
})