const mongoose = require('mongoose');
const config = require('../../config/database');
const crypto = require('crypto');
const spawn = require("child_process").spawn;

// Move Schema
const MoveSchema = mongoose.Schema({
	mDate: {
  		type: Date, 
  		default: Date.now
	},
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
	mCode: {
		type: String
	},
	mOld: {
		type: Number
	},
	mNew: {
		type: Number
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

module.exports.updateMove = function(move, callback){
	const query = {mCode: move.mCode};
	Move.findOneAndUpdate(query, 
    { $set: { 
		"mCode": move.mCode,
		"mAmmount": move.mAmmount,
		"mBAcc": move.mBAcc,
		"mTAcc": move.mTAcc,
		"mDesc": move.mDesc,
		"mSign": move.mSign,
    }},
	callback);
};

module.exports.setCode = function(move, code, callback){
	const query = {_id: move._id};
	Move.findOneAndUpdate(query, 
    { $set: { 
		"mCode": code
    }},
	callback);
};

module.exports.deleteMove = function(move, callback){

	var status = true;
	const bId = move.mBAcc;
	const tId = move.mTAcc;
	const mId = move.mCode;
	const updatePath = "./python/deleteMove.py";

	const updateOptions = [updatePath, bId, tId, mId];

	const updateProcess = spawn('python', updateOptions);

	var myData;

	updateProcess.stdout.on('data', (data) => {
		myData = data.toString();
	});

	updateProcess.on('close', (code) => {
		if(code == 'Error'){
			callback(new Error('Something happened'));
		} else{	
			const query = {mCode: mId}
			Move.findOneAndRemove(query, callback);	
		}
	});

};

module.exports.getMovesByTAcc = function(tacc, callback){
	const query = {mTAcc: tacc}
	Move.find(query, callback);	
};


module.exports.getCode = function(mId, bId, tId){
	let mCode = String(mId)
	mCode = mCode.substring(mCode.length-4,mCode.length);
	let code = String(mCode+'/'+bId+'/'+tId);
	return code;

};