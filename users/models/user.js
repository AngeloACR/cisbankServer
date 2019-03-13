const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../../config/database');
const crypto = require('crypto');


// User Schema
const UserSchema = mongoose.Schema({
	fName: {
		type: String,
		required: true
	},
	lName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	role:{
		type: String,
	},
	validToken: {
		type: String,
	},
	validTime: {
		type: Number,
	},
	validEmail:{
		type: Boolean
	},

});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback){
	const query = {username: username};
	User.findOne(query, callback);
};

module.exports.getUserByEmail = function(email, callback){
	const query = {email: email};
	User.findOne(query, callback);
};

module.exports.getUserByRole = function(role, callback){
	const query = {role: role};
	User.findOne(query, callback);
};

module.exports.addUser = function(newUser, callback){
	bcrypt.genSalt(10, (err, salt) => {
    	bcrypt.hash(newUser.password, salt, (err, hash) => {
        	if(err) throw err;
         	newUser.password = hash;
         	newUser.save(callback);
    	});
    });
};

module.exports.validateUser = function(username, callback){
	const query = {username: username};
	User.findOneAndUpdate(query, { 
	$set: { 
		"validEmail": true
		}
	},
	callback);
};

module.exports.deleteUser = function(userToDelete, callback){
	const query = {username: userToDelete.username}
	User.findOneAndRemove(query, callback);
};

module.exports.updateUser = function(updateData, callback){
	const query = {username: updateData.username};
	User.findOneAndUpdate(query, { 
	$set: { 
		"fName": updateData.fname,
    	"lName": updateData.lname,
    	"username": updateData.username,
		}
	},
	callback);
};

module.exports.setRole = function(userToUpdate, role, callback){
	const query = {username: userToUpdate.username};
	User.findOneAndUpdate(query, { 
	$set: { 
		"role": role,
	    }
	},
	callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if(err) throw err;
		callback(null, isMatch);
	});
};

module.exports.setToken = function(username, vToken, vTime, callback) {	
	const query = {username: username};
	User.findOneAndUpdate(query, { 
		$set: { 
			"validEmail": false,
			"validToken": vToken,
			"validTime": vTime
    	}
	},
	callback);
}

module.exports.genToken = function(username){
	
	const hash = crypto.createHash('sha1');
	
	var hrTime = process.hrtime();
	var validTime = hrTime[0] * 1000000 + hrTime[1] / 1000

	var toHash = username + validTime + config.vSecret;
	hash.update(toHash);
	return [hash.digest('hex'), validTime]


};
