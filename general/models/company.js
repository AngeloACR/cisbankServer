const mongoose = require('mongoose');
const config = require('../../config/database');

// Move Schema
const CompanySchema = mongoose.Schema({
	name: {
  		type: String
	},
	actMonths: [{
		type: String
	}],
	usersType: [{
		type: String
	}],
	taccs: [{
		type: String
	}],
	baccs: [{
		type: String
	}],
});

const company = module.exports = mongoose.model('company', CompanySchema, 'company');

module.exports.getInfo = function(callback){
	const query = {};
	company.findOne(query, callback);
};

module.exports.updateBAcc = function(newBacc, callback){
	const query = {};
	company.findOneAndUpdate(query, 
    {  $push: { 
    	"baccs": newTacc  
    }},
	callback);
};

module.exports.removeBAcc = function(delBacc, callback){
	const query = {};
	company.findOneAndUpdate(query,
    {  $pull: {
    	"baccs": delBacc
    }},
	callback);
};

module.exports.updateTAcc = function(newTacc, callback){
	const query = {};
	company.findOneAndUpdate(query, 
    {  $push: { 
    	"taccs": newTacc  
    }},
	callback);
};

module.exports.removeTAcc = function(delTacc, callback){
	const query = {};
	company.findOneAndUpdate(query,
    {  $pull: {
    	"taccs": delTacc
    }},
	callback);
};

module.exports.updateMonth = function(newMonth, callback){
	const query = {};
	company.findOneAndUpdate(query, 
    {  $push: { 
    	"actMonths": newMonth
    }},
	callback);
};