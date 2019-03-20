const mongoose = require('mongoose');
const config = require('../../config/database');
const crypto = require('crypto');

// Move Schema
const MoveSchema = mongoose.Schema({
	mCode: {
		type: String,
		required: true
	},
	mAmmount: {
		type: Number,
		required: true
	},
	mSign: {
		type: Boolean,
		default: true
	},
	mBAcc: {
		type: String,
		required: true
	},
	mTAcc: {
		type: String,
		required: true
	},
	mDesc: {
		type: String,
		required: true
	},
	isRemoved: {
		type: Boolean,
		default: false
	}
});

const Move = module.exports = mongoose.model('Move', MoveSchema);

module.exports.getMoveById = function(id, callback){
	Move.findById(id, callback);
};

module.exports.getMoveByCode = function(code, callback){
	const query = {mCode: code};
	Move.findOne(query, callback);
};

module.exports.getAllMoves = function(callback){
	const query = {};
	Move.find(query, callback);
};

module.exports.createMove = function(newMove, callback){
	newMove.save(callback);
};

/*
module.exports.deleteMove = function(moveToDelete, callback){
	const query = {mCode: moveToDelete.mCode}
	Move.findOneAndRemove(query, callback);	
};*/

module.exports.updateMoveCode = function(moveToUpdate, updateData, callback){
	const query = {mCode: moveToUpdate.mCode};
	Move.findOneAndUpdate(query, 
    { $set: { 
		"mCode": updateData.mCode
    }},
	callback);
};

module.exports.removeMove = function(rMove, callback){
	const query = {mCode: rMove.mCode};
	Move.findOneAndUpdate(query, 
    { $set: { 
    	"isRemoved": true
    }},
	callback);
};

module.exports.getCode = function(mBAcc, mTAcc){
	
	const hash = crypto.createHash('sha1');
	
	var hrTime = process.hrtime();
	var validTime = hrTime[0] * 1000000 + hrTime[1] / 1000

	var toHash = mBAcc + mTAcc + validTime + config.mSecret;
	hash.update(toHash);
	return hash.digest('hex');

};