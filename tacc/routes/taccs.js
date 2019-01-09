const express = require('express');
const tAccRouter = express.Router();
const TAcc = require('../models/tacc');
const passport = require('passport');


//Create TAcc
tAccRouter.post('/cTAcc', (req, res, next) => {

	const tName = req.body.tName;
	const tBalance = req.body.tBalance;
	const tType = req.body.tType;
	const tNature = req.body.tNature;

	let newTAcc = new TAcc({
		tName: tName,
		tBalance: tBalance,
		tType: tType,
		tNature: tNature
	});

	TAcc.createTAcc(newTAcc, (cErr, tAcc) => {
		if(cErr) {
			return res.json({
				success: false, 
				msg: cErr
			});
		}
		return res.json({
			success: true, 
			msg: 'TAcc registered'
		});	
	});

});

//Get TAcc
tAccRouter.get('/gTAcc', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const user = req.user;

	Checkoute.getCheckoutByUsername(user.username, (cErr,check) => {
	if(err) throw err;
		if(!check){
			console.log("Returning error");
			return res.json({
				success: false, 
				msg:'TAcc not found'
			});			
		} else{
			return res.json({
				success: true, 
				TAcc: check
			});				
		};
	});

});

//Update TAcc
tAccRouter.post('/uTAcc', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const user = req.user;
	const updateData = req.body.updateData

	let dataToUpdate = new TAcc({
		username: user.username,
		email: updateData.email,
		charges: updateData.Charges,
		cards: updateData.cards,
		bAddress: updateData.bAddress,
		sAddress: updateData.sAddress
	});

	Checkoute.getCheckoutByUsername(user.username, (err,check) => {
	if(err) throw err;
		if(!check){
			console.log("Returning error");
			return res.json({
				success: false, 
				msg:'TAcc not found'
			});			
		} else{
			TAcc.updateCheckout(check, dataToUpdate, (uErr,uCheck) => {
				return res.json({
					success: true, 
					msg: 'TAcc updated'
				});				
			});
		};
	});
});

//Delete TAcc
tAccRouter.post('/dTAcc', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const user = req.user;

	Checkoute.getCheckoutByUsername(user.username, (cErr,check) => {
	if(err) throw err;
		if(!check){
			return res.json({
				success: false, 
				msg:'TAcc not found'
			});			
		} else{
			TAcc.deleteCheckout(check, (cErr,dCheck) => {
				if(err) throw err;
				return res.json({
					success: true, 
					msg:'TAcc deleted'
				});			
			});	
		};
	});
});

module.exports = tAccRouter;