const express = require('express');
const bAccRouter = express.Router();
const BAcc = require('../models/bacc');
const passport = require('passport');

//Create BAcc
bAccRouter.post('/cBAcc', (req, res, next) => {

	const bAlias = req.body.bAlias;
	const bBank = req.body.bBank;
	const bBalance = req.body.bBalance;
	const bNumber = req.body.bNumber;

	let newBAcc = new BAcc({
		bAlias: bAlias,
		bBank: bBank,
		bBalance: bBalance,
		bNumber: bNumber,
	});
	BAcc.createBAcc(newBAcc, (cErr, bAcc) => {
		if(cErr) {
			return res.json({
				success: false, 
				msg: cErr
			});
		}
		console.log(bAcc);			
		return res.json({
			success: true, 
			msg: 'BAcc registered',
			bAcc: bAcc
		});	
	});

});

//Get BAcc
bAccRouter.post('/gBAcc', (req, res, next) => {

	const bAlias = req.body.bAlias;

	BAcc.getBAccByAlias(bAlias, (err,bAcc) => {
	if(err) throw err;
		if(!bAcc){
			return res.json({
				success: false, 
				msg:'BAcc not found'
			});			
		} else{
			return res.json({
				success: true, 
				BAcc: bAcc
			});				
		};
	});

});

// Get all BAccs
bAccRouter.get('/gBAccs', (req, res, next) => {
	
	BAcc.getAllBAccs( (err, banks) => {
		if (err) throw err;
		var bMap = [{}];
		var i = 0;
		banks.forEach(function(bank) {
			bMap[i] = bank;
			i++;
		});
		return res.json({
			banks: bMap
		});
	});
});


//Update BAcc
bAccRouter.post('/uBAcc', (req, res, next) => {
	
	const type = req.body.type;
	const bAlias = req.body.bAlias
	const updateData = req.body.updateData

	// Agregar switch case con todas las posibles actualizaciones


	BAcc.getBAccByAlias(bAlias, (err,bank) => {
	if(err) throw err;
		if(!bank){
			console.log("Returning error");
			return res.json({
				success: false, 
				msg:'BAcc not found'
			});			
		} else{
			BAcc.updateBAcc(bank, updateData, (uErr,uBAcc) => {
				return res.json({
					success: true, 
					msg: 'BAcc updated'
				});				
			});
		};
	});
});

//Delete BAcc
bAccRouter.post('/dBAcc', (req, res, next) => {

	const bAlias = req.body.bAlias

	BAcc.getBAccByAlias(bAlias, (cErr,bank) => {
	if(err) throw err;
		if(!bank){
			return res.json({
				success: false, 
				msg:'BAcc not found'
			});			
		} else{
			BAcc.deleteBAcc(bank, (cErr,dBank) => {
				if(err) throw err;
				return res.json({
					success: true, 
					msg:'BAcc deleted'
				});			
			});	
		};
	});
});

module.exports = bAccRouter;