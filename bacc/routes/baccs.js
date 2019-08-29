const express = require('express');
const bAccRouter = express.Router();
const BAcc = require('../models/bacc');
const passport = require('passport');

//Create BAcc
bAccRouter.post('/cBAcc', (req, res, next) => {

	const bAlias = req.body.bAlias;
	const bBank = req.body.bBank;
//	const bBalance = req.body.bBalance;
	const bNumber = req.body.bNumber;
	const bAct = req.body.bAct;
	const bAddress: req.body.bAddress,
	const bPhone: req.body.bPhone,
	const bEx: req.body.bEx,
	const bExPhone: req.body.bExPhone,

	let newBAcc = new BAcc({
		bAlias: bAlias,
		bBank: bBank,
		bBalance: 0,
		bNumber: bNumber,
		bAct: bAct,
		bAddress: bAddress,
		bPhone: bPhone,
		bEx: bEx,
		bExPhone: bExPhone,

	});
	
	BAcc.createBAcc(newBAcc, (cErr, bAcc) => {
		if(cErr) {
			return res.json({
				success: false, 
				msg: cErr
			});
		}		
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
		if (banks && banks.length) {   
			banks.forEach(function(bank) {
				bMap[i] = bank;
				i++;
			});
			return res.json({
				status: true,
				banks: bMap
			});
		} else {
			return res.json({
				status: false,
				banks: bMap
			});
		}

	});
});


//Update BAcc
bAccRouter.post('/uBAcc', (req, res, next) => {
	
	const bAlias = req.body.bAlias;
	const bBank = req.body.bBank;
	const bBalance = req.body.bBalance;
	const bNumber = req.body.bNumber;
	const bAct = req.body.bAct;

	let uBAcc = new BAcc({
		bAlias: bAlias,
		bBank: bBank,
		bBalance: bBalance,
		bNumber: bNumber,
		bAct: bAct
	});
		console.log(bAlias);

	BAcc.getBAccByAlias(bAlias, (err,bank) => {
		if(err) throw err;
		if(!bank){
			console.log('here 1');
			return res.json({
				success: false, 
				msg:'BAcc not found'
			});			
		} else{
			console.log('here 2');
			BAcc.updateBAcc(uBAcc, (uErr,ubacc) => {
				if(uErr) throw uErr;
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
	if(cErr) throw cErr;
		if(!bank){
			return res.json({
				status: false, 
				msg:'BAcc not found'
			});			
		} else{
			BAcc.deleteBAcc(bAlias, (dErr,dBank) => {
				if(dErr) throw dErr;
				return res.json({
					status: true, 
					msg:'BAcc deleted'
				});			
			});	
		};
	});
});

module.exports = bAccRouter;