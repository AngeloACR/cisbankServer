const express = require('express');
const tAccRouter = express.Router();
const TAcc = require('../models/tacc');
const passport = require('passport');

//Create TAcc
tAccRouter.post('/cTAcc', (req, res, next) => {

	const tName = req.body.tName;
	//const tBalance = req.body.tBalance;
	const tType = req.body.tType;
	const tNature = req.body.tNature;

	let newTAcc = new TAcc({
		tName: tName,
		tBalance: 0,
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
			msg: 'TAcc registered',
			tAcc: tAcc
		});	
	});

});

//Get TAcc
tAccRouter.post('/gTAcc', (req, res, next) => {

	const tName = req.body.tName;

	TAcc.getTAccByName(tName, (err,tAcc) => {
	if(err) throw err;
		if(!tAcc){
			return res.json({
				success: false, 
				msg:'tAcc not found'
			});			
		} else{
			return res.json({
				success: true, 
				TAcc: tAcc
			});				
		};
	});

});

// Get all BAccs
tAccRouter.get('/gTAccs', (req, res, next) => {
	TAcc.getAllTAccs( (err, tAccs) => {
		if (err) throw err;
		var tMap = [{}];
		var i = 0;
		if (tAccs && tAccs.length) {   
			tAccs.forEach(function(tAcc) {
				tMap[i] = tAcc;
				i++;
			});
			return res.json({
				status: true,
				tAccs: tMap
			});
		} else {
			return res.json({
				status: false
			});
		}		
	});
});


//Update BAcc
tAccRouter.post('/uTAcc', (req, res, next) => {
	
	const type = req.body.type;
	const tName = req.body.tName
	const updateData = req.body.updateData

	// Agregar switch case con todas las posibles actualizaciones


	TAcc.getTAccByName(tName, (err,tAcc) => {
	if(err) throw err;
		if(!tAcc){
			console.log("Returning error");
			return res.json({
				success: false, 
				msg:'TAcc not found'
			});			
		} else{
			TAcc.updateTAcc(tAcc, updateData, (uErr,uTAcc) => {
				return res.json({
					success: true, 
					msg: 'TAcc updated'
				});				
			});
		};
	});
});

//Delete BAcc
tAccRouter.post('/dTAcc', (req, res, next) => {

	const tName = req.body.tName

	TAcc.getTAccByName(tName, (cErr,tAcc) => {
	if(err) throw err;
		if(!tAcc){
			return res.json({
				success: false, 
				msg:'TAcc not found'
			});			
		} else{
			TAcc.deleteTAcc(tAcc, (cErr,dTAcc) => {
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