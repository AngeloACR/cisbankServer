const express = require('express');
const moveRouter = express.Router();
const Move = require('../models/move');
const passport = require('passport');
const spawn = require("child_process").spawn;

//Create Move
moveRouter.post('/cMove', (req, res, next) => {

//	const mCode = Move.estimatedDocumentCount();					//INGENIARSE UN METODO DE ASIGNACION DE MCODE
	const mAmmount = req.body.mAmmount;
	const mBAcc = req.body.mBAcc;
	const mSign = req.body.mSign;
	const mDesc = req.body.mDesc;
	const mTAcc = req.body.mTAcc;

	let newMove = new Move({
		mAmmount: mAmmount,
		mBAcc: mBAcc,
		mTAcc: mTAcc,
		mDesc: mDesc,
		mSign: mSign
	});

	Move.createMove(newMove, (cErr, move) => {
		if(cErr) {
			return res.json({
				success: false, 
				msg: cErr
			});
		}
		
		mCode = Move.getCode(move._id, mBAcc, mTAcc);
		Move.setCode(move, mCode, (cErr, fMove) =>{

			const bId = mBAcc;
			const tId = mTAcc;
			const mId = mCode;

			const updatePath = "./python/updateBalance.py";

			const updateOptions = [updatePath, bId, tId, mId];

			const updateProcess = spawn('python', updateOptions);

			var myData
			updateProcess.stdout.on('data', (data) => {
				console.log(data.toString());
				myData = data.toString();
			});

			updateProcess.on('close', (code) => {
				return res.json({
					success: true, 
					msg: myData
				});	
			});
		});

/*		return res.json({
			success: true, 
			msg: 'Move registered',
			move: move
		});
*/
	});

});

//Get Move
moveRouter.post('/gMove', (req, res, next) => {

	const mCode = req.body.mCode;
	Move.getMoveByCode(mCode, (err,bAcc) => {
	if(err) throw err;
		if(!bAcc){
			return res.json({
				success: false, 
				msg:'Move not found'
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
moveRouter.get('/gMoves', (req, res, next) => {	
	Move.getAllMoves( (err, moves) => {
		if (err) throw err;
		var mMap = [{}];
		var i = 0;
		if (moves && moves.length) {   
			moves.forEach(function(move) {
				mMap[i] = move;
				i++;
			});
			return res.json({
				status: true,
				moves: mMap
			});
		} else {
			return res.json({
				status: false
			});
		}
	});
});


//Update BAcc
moveRouter.post('/uMove', (req, res, next) => {
	
	const type = req.body.type;
	const mCode = req.body.mCode
	const updateData = req.body.updateData

	// Agregar switch case con todas las posibles actualizaciones


	Move.getMoveByCode(mCode, (err,move) => {
	if(err) throw err;
		if(!move){
			console.log("Returning error");
			return res.json({
				success: false, 
				msg:'Move not found'
			});			
		} else{
			Move.updateMove(move, updateData, (uErr,uMove) => {
				return res.json({
					success: true, 
					msg: 'Move updated'
				});				
			});
		};
	});
});

//Remove Move
moveRouter.post('/rMove', (req, res, next) => {

	const mCode = req.body.mCode

	Move.getMoveByCode(mCode, (cErr,move) => {
	if(err) throw err;
		if(!move){
			return res.json({
				success: false, 
				msg:'Move not found'
			});			
		} else{
			Move.removeMove(move, (cErr,dMove) => {
				if(err) throw err;
				return res.json({
					success: true, 
					msg:'Move deleted'
				});			
			});	
		};
	});
});


/*
//Delete BAcc
moveRouter.post('/dMove', (req, res, next) => {

	const mCode = req.body.mCode

	Move.getMoveByCode(mCode, (cErr,move) => {
	if(err) throw err;
		if(!move){
			return res.json({
				success: false, 
				msg:'Move not found'
			});			
		} else{
			Move.deleteMove(move, (cErr,dMove) => {
				if(err) throw err;
				return res.json({
					success: true, 
					msg:'Move deleted'
				});			
			});	
		};
	});
});
*/
module.exports = moveRouter;