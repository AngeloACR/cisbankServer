const mongoose = require('mongoose');
const config = require('../../config/database');

// BAcc Schema
const BAccSchema = mongoose.Schema({
	bAlias: {
		type: String,
		required: true
	},
	bBalance: {
		type: Number,
		required: true
	},
	bNumber: {
		type: String,
		required: true
	},
	bBank: {
		type: String,
		required: true
	},
	bMoves:[{
		type: String
	}],
	bAct:{
		type: String,
		required: true
	},
	bAddress: {
		type: String,
	},
	bPhone: {
		type: String,
		required: true
	},
	bEx:{
		type: String
	},
	bExPhone:{
		type: String
	}
});

const BAcc = module.exports = mongoose.model('BAcc', BAccSchema);

module.exports.getBAccById = function(id, callback){
	BAcc.findById(id, callback);
};

module.exports.getBAccByAlias = function(alias, callback){
	const query = {bAlias: alias};
	BAcc.findOne(query, callback);
};

module.exports.getAllBAccs = function(callback){
	const query = {};
	BAcc.find(query, callback);
};

module.exports.createBAcc = function(newBAcc, callback){
	newBAcc.save(callback);
};

module.exports.deleteBAcc = function(bAlias, callback){
	const query = {bAlias: bAlias}
	BAcc.findOneAndRemove(query, callback);	
};

module.exports.updateBAcc = function(bAcc, callback){
	const query = {bAlias: bAcc.bAlias};
	console.log('updating this: ' + query);
	BAcc.findOneAndUpdate(query, 
    { $set: { 
		"bAct": bAcc.bAct,
		"bNumber": bAcc.bNumber,
		"bBank": bAcc.bBank
    }},
	callback);
};
