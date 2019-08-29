const mongoose = require('mongoose');
const config = require('../../config/database');
const crypto = require('crypto');

// Move Schema
const MTAccSchema = mongoose.Schema({
	tName: {
		type: String,
		required: true
	},
	tMonth: {
  		type: String,
		required: true
	},
	tBalance: {
		type: Number,
		required: true
	}
});

const mTAcc = module.exports = mongoose.model('mTAcc', MTAccSchema);

module.exports.getMTAccById = function(id, callback){
	mTAcc.findById(id, callback);
};

module.exports.getMTAccByName = function(name, callback){
	mTAcc.findById(name, callback);
};

module.exports.getMTAccByMonth = function(tMonth, callback){
	const query = {tMonth: tMonth};
	mTAcc.findOne(query, callback);
};

module.exports.getAllMTAccs = function(callback){
	const query = {};
	mTAcc.find(query, callback);
};

module.exports.createMTAcc = function(newMTAcc, callback){
	newMTAcc.save(callback);
};