const mongoose = require('mongoose');
const config = require('../../config/database');
const crypto = require('crypto');

// Move Schema
const DTAccSchema = mongoose.Schema({
	tDate: {
  		type: String,
		required: true
	},
	tName: {
		type: String,
		required: true
	},
	tBalance: {
		type: Number,
		required: true
	}
});

const dTAcc = module.exports = mongoose.model('dTAcc', DMoveSchema);

module.exports.getDMoveById = function(id, callback){
	dTAcc.findById(id, callback);
};

module.exports.getDMoveByDate = function(tDate callback){
	const query = {tDate: date};
	dTAcc.findOne(query, callback);
};

module.exports.getAllDTAccs = function(callback){
	const query = {};
	dTAcc.find(query, callback);
};

module.exports.createDTAcc = function(newDTAcc, callback){
	newDTAcc.save(callback);
};