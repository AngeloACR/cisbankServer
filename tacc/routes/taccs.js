const express = require('express');
const tAccRouter = express.Router();
const TAcc = require('../models/tacc');
const passport = require('passport');
const MTAcc = require('../models/mtacc');

//Create TAcc
tAccRouter.post('/cTAcc', (req, res, next) => {

	const tName = req.body.tName;
	const tMonth = req.body.tMonth;
	const tType = req.body.tType;
	const tNature = req.body.tNature;

	let newTAcc = new TAcc({
		tName: tName,
		tBalance: 0,
		tType: tType,
		tNature: tNature
	});

	let newMTAcc = new MTAcc({
		tName: tName,
		tMonth: tMonth,
		tNature: tNature,
		tBalance: 0
	});
	MTAcc.createMTAcc(newMTAcc, (mErr, mtAcc) =>{
		if(mErr) console.log(mErr);
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
		})
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
	if(cErr) throw cErr;
		if(!tAcc){
			return res.json({
				status: false, 
				msg:'TAcc not found'
			});			
		} else{
			TAcc.deleteTAcc(tAcc, (dErr,dTAcc) => {
				if(dErr) throw dErr;
				return res.json({
					status: true, 
					msg:'TAcc deleted'
				});			
			});	
		};
	});
});

// Get all BAccs
tAccRouter.get('/gmTAccs', (req, res, next) => {
	MTAcc.getAllMTAccs( (err, mtAccs) => {
		if (err) throw err;
		var tMap = [{}];
		var i = 0;
		if (mtAccs && mtAccs.length) {   
			mtAccs.forEach(function(mtAcc) {
				tMap[i] = mtAcc;
				i++;
			});
			return res.json({
				status: true,
				mtAccs: tMap
			});
		} else {
			return res.json({
				status: false
			});
		}		
	});
});

module.exports = tAccRouter;