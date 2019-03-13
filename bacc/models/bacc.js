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
	status:{
		type: Boolean,
		default: true
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

module.exports.deleteBAcc = function(bAccToDelete, callback){
	const query = {bAlias: bAccToDelete.bAlias}
	BAcc.findOneAndRemove(query, callback);	
};

module.exports.updateBAccAlias = function(bAccToUpdate, updateData, callback){
	const query = {bAlias: bAccToUpdate.bAlias};
	BAcc.findOneAndUpdate(query, 
    { $set: { 
		"bName": updateData.bAlias

    }},
	callback);
};

module.exports.updateBAccBalance = function(bAccToUpdate, updateData, callback){
	const query = {bAlias: bAccToUpdate.bAlias};
	BAcc.findOneAndUpdate(query, 
    { $set: { 
    	"bBalance": updateData.bBalance
    }},
	callback);
};
