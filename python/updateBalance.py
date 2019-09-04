#!/usr/bin/python2.7

from pymongo import MongoClient
import sys

#global connection

#global baccs 
#global taccs 
#global moves 

#global bacc 
#global tacc 
#global move 

global dOut

def connectDB(myDB):
	try:
		connection = MongoClient(myDB)
		return connection
#		taccs = connection.cisbank.TAcc
#		baccs = connection.cisbank.BAcc
#		moves = connection.cisbank.Moves
	except:
		sendResult("Connect Error")

def closeConnect(connection):
	try:
		connection.close()
	except:
		sendResult("Close Error")

def updateB(bId, mId, myDB):
	try:
		bConnect = connectDB(myDB)

		baccs = bConnect.cisbank.baccs
		moves = bConnect.cisbank.moves
		
		bQuery = {'bAlias': bId}
		mQuery = {'mCode': mId}
		bacc = baccs.find_one(bQuery)
		move = moves.find_one(mQuery)
		if move['mSign']:
			newBalance = bacc['bBalance'] + move['mAmmount']
		else:
			newBalance = bacc['bBalance'] - move['mAmmount']

		oldB = bacc['bBalance']

		newMoves = []

		newMoves.extend(bacc['bMoves'])
		newMoves.append(mId)

		mOld = { "$set": { "mOld": bacc['bBalance'] } }
		mNew = { "$set": { "mNew": newBalance } }

		bBalance = { "$set": { "bBalance": newBalance } }
		bMoves = { "$set": { "bMoves": newMoves } }


		
		baccs.update_one(bQuery, bBalance)
		baccs.update_one(bQuery, bMoves)
		
		moves.update_one(mQuery, mOld)
		moves.update_one(mQuery, mNew)


		closeConnect(bConnect)
		status = True
		return status

	except Exception as ex:
		template = "An exception of type {0} occurred. Arguments:\n{1!r}"
		message = template.format(type(ex).__name__, ex.args)
		sendResult(message)
		status = False
		return status


def updateT(tId, mId, myDB):
	try:
		tConnect = connectDB(myDB)

		taccs = tConnect.cisbank.taccs
		moves = tConnect.cisbank.moves

		tQuery = {'tName': tId}
		mQuery = {'mCode': mId}
		tacc = taccs.find_one(tQuery)
		move = moves.find_one(mQuery)

		newBalance = tacc['tBalance'] + move['mAmmount']

		newMoves = []
		newMoves.extend(tacc['tMoves'])
		newMoves.append(mId)

		tBalance = { "$set": { "tBalance": newBalance } }
		tMoves = { "$set": { "tMoves": newMoves } }
		
		taccs.update_one(tQuery, tBalance)
		taccs.update_one(tQuery, tMoves)
		closeConnect(tConnect)
		status = True
		return status
	
	except Exception as ex:
		template = "An exception of type {0} occurred. Arguments:\n{1!r}"
		message = template.format(type(ex).__name__, ex.args)
		sendResult(message)
		status = False
		return status

def totalizeMove(mDate, mId, myDB):
	try:
		tConnect = connectDB(myDB)

		dmoves = tConnect.cisbank.dmoves
		moves = tConnect.cisbank.moves

		dQuery = {'mDate': mDate}
		dmove = dmoves.find_one(dQuery)
		mQuery = {'mCode': mId}
		move = moves.find_one(mQuery)

		if move['mSign']:
			newDebe = dmove['mDebe'] + move['mAmmount']
			mDebe = { "$set": { "mDebe": newDebe } }
			dmoves.update_one(dQuery, mDebe)
			newTotal = dmove['mTotal'] + move['mAmmount']
			mTotal = { "$set": { "mTotal": newTotal } }
			dmoves.update_one(dQuery, mTotal)
		else:
			newHaber = dmove['mHaber'] + move['mAmmount']
			mHaber = { "$set": { "mHaber": newHaber } }
			dmoves.update_one(dQuery, mHaber)
			newTotal = dmove['mTotal'] - move['mAmmount']
			mTotal = { "$set": { "mTotal": newTotal } }
			dmoves.update_one(dQuery, mTotal)
		

		closeConnect(tConnect)
		status = True
		return status
	
	except Exception as ex:
		template = "An exception of type {0} occurred. Arguments:\n{1!r}"
		message = template.format(type(ex).__name__, ex.args)
		sendResult(message)
		status = False
		return status

def totalizeMonths(tId, mId, myDB):
	try:
		tConnect = connectDB(myDB)

		moves = tConnect.cisbank.moves
		mtaccs = tConnect.cisbank.mtaccs

		mQuery = {'mCode': mId}
		move = moves.find_one(mQuery)

		mtQuery = {'tName': tId}
		mtacc = mtaccs.find_one(mtQuery)

		newBalance = mtacc['tBalance'] + move['mAmmount']
		mtBalance = { "$set": { "tBalance": newBalance } }
		
		mtaccs.update_one(mtQuery, mtBalance)
		closeConnect(tConnect)
		status = True
		return status
	
	except Exception as ex:
		template = "An exception of type {0} occurred. Arguments:\n{1!r}"
		message = template.format(type(ex).__name__, ex.args)
		sendResult(message)
		status = False
		return status

def sendResult(dOut):
	print(dOut)
	sys.stdout.flush()

def main():
	#myDB = "mongodb://localhost:27017/cisbank"
	myDB = "mongodb://angeloacr:cisbankDataBase47@ds051595.mlab.com:51595/cisbank"

	bId = sys.argv[1]
	tId = sys.argv[2]
	mId = sys.argv[3]
	#mDate = sys.argv[4]
	statusB = updateB(bId, mId, myDB)
	statusT = updateT(tId, mId, myDB)
	#statusM = totalizeMove(mDate, mId, myDB)
	statusA = totalizeMonths(tId, mId, myDB)
	if statusB and statusT and statusM:
		sendResult("Success")
	else:
		sendResult("Error")

#if __name__ == "__main__":
 #   sendResult("Init")
main()