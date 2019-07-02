const mongoose = require('mongoose');
const config = require('../../config/database');
const crypto = require('crypto');

// Move Schema
const MMoveSchema = mongoose.Schema({
	mMonth: {
  		type: String,
		required: true
	},
	mDebe: {
		type: Number,
		required: true
	},
	mHaber: {
		type: Number,
		required: true
	},
	mTotal: {
		type: Number,
		default: true
	},
	mClose: {
		type: Boolean,
		required: true
	}
});

const mMove = module.exports = mongoose.model('mMove', MMoveSchema);

module.exports.getDMoveById = function(id, callback){
	mMove.findById(id, callback);
};

module.exports.getDMoveByMonth = function(month, callback){
	const query = {mMonth: date};
	mMove.findOne(query, callback);
};

module.exports.getAllDMoves = function(callback){
	const query = {};
	mMove.find(query, callback);
};

module.exports.createDMove = function(newMMove, callback){
	newMMove.save(callback);
};