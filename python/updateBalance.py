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

		newMoves = []
		newMoves.extend(bacc['bMoves'])
		newMoves.append(mId)

		bBalance = { "$set": { "bBalance": newBalance } }
		bMoves = { "$set": { "bMoves": newMoves } }
		
		baccs.update_one(bQuery, bBalance)
		baccs.update_one(bQuery, bMoves)
		
		closeConnect(bConnect)
	except:
		sendResult("Updating Bank Error")

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
		tMoves = { "$set": { "tMove": newMoves } }
		
		taccs.update_one(tQuery, tBalance)
		taccs.update_one(tQuery, tMoves)

		closeConnect(tConnect)
	except:
		sendResult("Updating T Error")

def sendResult(dOut):
	print(dOut)
	sys.stdout.flush()

def main():
	#myDB = "mongodb://localhost:27017/cisbank"
	myDB = "mongodb://angeloacr:cisbankDataBase47@ds051595.mlab.com:51595"

	bId = sys.argv[1]
	tId = sys.argv[2]
	mId = sys.argv[3]
	updateB(bId, mId, myDB)
	updateT(tId, mId, myDB)
	sendResult("Success")

#if __name__ == "__main__":
 #   sendResult("Init")
main()