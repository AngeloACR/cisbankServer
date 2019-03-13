const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const async = require('async')
const nodemailer = require('nodemailer');
const User = require('../models/user');
const config = require('../../config/database');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: config.contactMail, 
            pass: config.contactPass  
        }
    });

//**************************** USER CRUD************************************//

userRouter.post('/cUser', (req, res, next) => {
	
	const user = {
		fName: req.body.fName,
		lName: req.body.lName, 
		email: req.body.email,
		validEmail: false,
		username: req.body.username,
		password: req.body.password,
		role: req.body.role,
	}

	let newUser = new User(user);

	var gUser = function(callback){
		getUser(newUser.username, (err, user) => {
			if(err) callback(err);
			if(!user){					
				callback(null);
			} else {
				callback(new Error('Username already in use'))
			}
		});
	}

	var gMail = function(callback){
		getMail(newUser.email, (err, user) => {
			if(err) callback(err);
			if(!user){					
				callback(null);
			} else {
				callback(new Error('Email already in use'))
			}
		});
	}

	var aUser = function(callback){
		addUser(newUser, (err, user) => {
			if(err) callback(err);
			if(user){
				callback(null, user);
			} else {
				callback(new Error('There was an error'));
			}
		})
	}
		
	async.series([
		gUser,
		gMail,
		aUser
	], function (err, result) {
		if (err) {
			return res.json({
				success: false, 				
				msg: err.message			
			});
		} else {
			return res.json({
				success: true, 				
				msg: result			
			});    	
		}
    });	
});

// Delete user
userRouter.get('/dUser', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const user = req.user;

	let userToDelete = new User({
		username: user.username
	});

	var gUser = function(callback){
		getUser(user.username, (err, uUser) => {
			if(err) callback(err);
			if(user){					
				callback(null, user);
			} else {
				callback(new Error('Username not found'))
			}
		});
	}

	var dUser = function(user, callback){
		User.deleteUser(user, (err, dUser) =>{
			if(err) callback(err);
			callback(null)
		});
	}
	async.series([
		gUser,
		dUser
	], function (err, result) {
		if (err) {
			return res.json({
				success: false, 				
				msg: err.message			
			});
		} else {
			return res.json({
				success: true, 				
				msg: 'User deleted'			
			});    	
		}
    });	
});

// Update user, NEED TO IMPROVE
userRouter.post('/uUser', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const user = req.user;
	const updateData = req.body.updateData;

	let dataToUpdate = new User({
		username: user.username,
		fName: updateData.fName,
		lName: updateData.lName,		
		email: updateData.email
	});

	var gUser = function(callback){
		getUser(user.username, (err, uUser) => {
			if(err) callback(err);
			if(uUser){					
				callback(null, uUser);
			} else {
				callback(new Error('Username not found'))
			}
		});
	}

	var uUser = function(user, callback){
		User.updateUser(dataToUpdate, (err, uUser) =>{
			if(err) callback(err);
			if(uUser){
				callback(null, user);			
			}	
		});
	}		

	async.waterfall([
    	gUser,
    	uUser
	], function (err, result) {
		if (err) {
			return res.json({
					success: false, 				
					msg: err.message			
				});
		}
		return res.json({
			success: true, 				
			msg: result			
		});    	
    });
});

// Get User
userRouter.get('/gUser', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	console.log(req.user);
	return res.json({
		user: req.user
	});
});

//*************************************USER AUTHENTICATION*********************************//

// Authenticate
userRouter.post('/authUser', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	//var sess = req.session;


	var gUser = function(callback){
		getUser(username, (err, user) => {
			if(err) callback(err);
			if(user){					
				callback(null, user);
			} else {
				callback(new Error('Login failed, invalid username or password'));
			}
		});
	}
	

	var cPass = function(user, callback){
		User.comparePassword(password, user.password, (err, isMatch) => {
			if(err) throw err;
			if(isMatch){
				const token = jwt.sign(user, config.authSecret, {
					expiresIn: 604800 //1 week
				});
/*				sess.username = username;
				sess.isLogged = true;
				sess.jwToken = "JWT " + token;
*/				var res = {
					success: true,
					token: 'JWT '+token,
					user: {
						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email
					}
				}
				callback(null, res);
			} else{
				callback(new Error('Login failed, invalid username or password'));
			}
		});
	}


	async.waterfall([
    	gUser,
    	cPass
	], function (err, result) {
		if (err) {
			return res.json({
					success: false, 				
					msg: err.message			
				});
		}
		return res.json(result);    	
    });
});



//****************************MAIL VALIDATION************************//



userRouter.post('/cToken', (req, res, next) => {
	const username = req.body.username;


	var gUser = function(callback){
		getUser(username, (err, user) => {
			if(err) callback(err);
			if(user){					
				callback(null, user);
			} else {
				callback(new Error('Username not found'))
			}
		});
	}

	var setToken = function(vUser, callback){
		vCombo = User.genToken(vUser.username);
		User.setToken(vUser.username, vCombo[0], vCombo[1], (err, uToken) => {
			if(err) callback(err);
			if(uToken){
				callback(null, uToken);
			} else {
				callback( new Error('Problems updating') )
			}			
		});
	} 

	var sendMail = function(uToken, callback){
		var mailOptions = {
		    from: '"Cisbank" <contacto@cisbank.com>', // sender address
		    to: uToken.email, // list of receivers
		    subject: 'Cisbank validation', // Subject line
		    text: 'Hello! come on and enjoy the cisbank adventure!', // plaintext body
		    html: '<b>'+vCombo[0]+'</b>' // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        callback(error);
		    }
		    console.log('Message sent: ' + info.response);
			callback(null, info.response);
		});
	}

	async.waterfall([
    	gUser,
    	setToken,
    	sendMail,
	], function (err, result) {
		if (err) {
			return res.json({
					success: false, 				
					msg: err.message			
				});
		}
		return res.json({
			success: true, 				
			msg: result			
		});    	
    });
});



// Validate user
userRouter.post('/vUser', (req, res, next) => {

	const username = req.body.username;
	const vToken = req.body.vToken;

	const hrTime = process.hrtime();
	const thisTime = hrTime[0] * 1000000 + hrTime[1] / 1000
	const maxTime = 3600*8*1000000; 

	var gUser = function(callback){
		getUser(username, (err, user) => {
			if(err) callback(err);
			if(user){					
				callback(null, user);
			} else {
				callback(new Error('Username not found'))
			}
		});
	}

	var validUser = function(user, callback) {
		User.validateUser(user.username, (err, vUser) =>{
			if(err) callback(err);
			if(vUser) {
				if(thisTime - user.validTime < maxTime) {
					if(vUser.validToken == vToken){
						callback(null, vUser)
					} else{
						callback(new Error('Wrong token'));
					}			
				} else {
					callback(new Error('Token has expired'));
				} 
			}
		}); 
	} 

	async.waterfall([
    	gUser,
    	validUser
	], function (err, result) {
		if (err) {
			return res.json({
					success: false, 				
					msg: err.message			
				});
		}
		return res.json({
			success: true, 				
			msg: result			
		});    	
    });
});


//*****************ROUTES TO DB MIDDLEWARE*********************//

function getUser (username, callback) {
	User.getUserByUsername(username, (err, user) => {
		if(err) callback(err);
		if(user){
			callback(null, user) ;
		} else {
			callback(null, false) ;
		}
	});
}

function getMail(email, callback) {
	User.getUserByEmail(email, (err, user) => {
		if(err) callback(err);
		if(user){
			callback(null, user);
		} else{

			callback(null, false);			}
	});
}

function addUser (newUser, callback) {
	User.addUser(newUser, (err, user) => {
		if(err){
			callback(new Error('Failed to create user'))
		} else {
			callback(null, user);	
		}	
	});
}

module.exports = userRouter;