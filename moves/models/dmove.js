const mongoose = require('mongoose');
const config = require('../../config/database');
const crypto = require('crypto');

// Move Schema
const DMoveSchema = mongoose.Schema({
	mDate: {
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

const dMove = module.exports = mongoose.model('dMove', DMoveSchema);

module.exports.getDMoveById = function(id, callback){
	dMove.findById(id, callback);
};

module.exports.getDMoveByDate = function(date, callback){
	const query = {mDate: date};
	dMove.findOne(query, callback);
};

module.exports.getAllDMoves = function(callback){
	const query = {};
	dMove.find(query, callback);
};

module.exports.createDMove = function(newDMove, callback){
	newDMove.save(callback);
};