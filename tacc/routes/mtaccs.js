const express = require('express');
const mtAccRouter = express.Router();
const mTAcc = require('../models/mtacc');
const company = require('../../general/models/company');
const passport = require('passport');
const async = require('async');

//Create mTAcc
mtAccRouter.post('/cmTAcc', (req, res, next) => {

	const tName = req.body.tName;
	//const tBalance = req.body.tBalance;
	const tType = req.body.tType;
	const tNature = req.body.tNature;

	let newmTAcc = new mTAcc({
		tName: tName,
		tBalance: 0,
		tType: tType,
		tNature: tNature
	});

	mTAcc.createMTAcc(newmTAcc, (cErr, mtAcc) => {
		if(cErr) {
			return res.json({
				success: false, 
				msg: cErr
			});
		}
		return res.json({
			success: true, 
			msg: 'mTAcc registered',
			mtAcc: mtAcc
		});	
	});

});

//Get mTAcc
mtAccRouter.get('/gmTAccs', (req, res, next) => {
	
	var getInfo = function(callback){
		company.getInfo( (err, info) => {
		if(err) throw err;
			if(info){
				callback(null, info);
			} else {
				callback(new Error('Something is wrong, try again in a million years'))
			}
		});		
	}

	var getMTaccs = function(info, callback){
		const months = info.actMonths;
		const taccs = info.taccs
		mTAcc.getAllMTAccs( (err, mtaccs) => {
		if(err) throw err;
			if(mtaccs){
				var tMap = {};
				for (let month of months){
					tMap[month] = [{}]
					for (let tacc of taccs){
						var i = 0
						for (let mtacc of mtaccs){
							if (mtacc.tName == tacc){
								tMap[month].push(mtacc);
								i++;
							}
						}
					}
				}
				callback(null, tMap);
			} else {
				callback(new Error('Something is wrong, try again in a million years'))
			}
		});		
	}

	async.waterfall([
		getInfo,
		getMTaccs
	], function (err, tMap){
		if (err) {
		return res.json({
			status: false
		});
		}
			if(tMap){					
			return res.json({
				status: true,
				mtAccs: tMap
			});
		}
		}
	);
});

// Get all BAccs
/*mtAccRouter.get('/gmTAccs', (req, res, next) => {
	mTAcc.getAllMTAccs( (err, mtAccs) => {
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
});*/


//Update BAcc
mtAccRouter.post('/umTAcc', (req, res, next) => {
	
	const type = req.body.type;
	const tName = req.body.tName
	const updateData = req.body.updateData

	// Agregar switch case con todas las posibles actualizaciones


	mTAcc.getmTAccByName(tName, (err,mtAcc) => {
	if(err) throw err;
		if(!mtAcc){
			console.log("Returning error");
			return res.json({
				success: false, 
				msg:'mTAcc not found'
			});			
		} else{
			mTAcc.updatemTAcc(mtAcc, updateData, (uErr,umTAcc) => {
				return res.json({
					success: true, 
					msg: 'mTAcc updated'
				});				
			});
		};
	});
});

//Delete BAcc
mtAccRouter.post('/dmTAcc', (req, res, next) => {

	const tName = req.body.tName

	mTAcc.getmTAccByName(tName, (cErr,mtAcc) => {
	if(err) throw err;
		if(!mtAcc){
			return res.json({
				status: false, 
				msg:'mTAcc not found'
			});			
		} else{
			mTAcc.deletemTAcc(mtAcc, (cErr,dmTAcc) => {
				if(err) throw err;
				return res.json({
					status: true, 
					msg:'mTAcc deleted'
				});			
			});	
		};
	});
});

module.exports = mtAccRouter;