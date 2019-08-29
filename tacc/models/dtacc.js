const mongoose = require('mongoose');
const config = require('../../config/database');
const crypto = require('crypto');

// Move Schema
const DTAccSchema = mongoose.Schema({
	tName: {
		type: String,
		required: true
	},
	tDate: {
  		type: String,
		required: true
	},
	tBalance: {
		type: Number,
		required: true
	}
});

const dTAcc = module.exports = mongoose.model('dTAcc', DTAccSchema);

module.exports.getDTAccById = function(id, callback){
	dTAcc.findById(id, callback);
};

module.exports.getDTAccByName = function(name, callback){
	dTAcc.findById(name, callback);
};

module.exports.getDTAccByDate = function(tDate, callback){
	const query = {tDate: tDate};
	dTAcc.findOne(query, callback);
};

module.exports.getAllDTAccs = function(callback){
	const query = {};
	dTAcc.find(query, callback);
};

module.exports.createDTAcc = function(newDTAcc, callback){
	newDTAcc.save(callback);
};