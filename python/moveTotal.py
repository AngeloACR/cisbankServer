#!/usr/bin/python2.7

from pymongo import MongoClient
import sys

global dOut

def connectDB(myDB):
	try:
		connection = MongoClient(myDB)
		return connection
	except:
		sendResult("Connect Error")

def closeConnect(connection):
	try:
		connection.close()
	except:
		sendResult("Close Error")


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

def sendResult(dOut):
	print(dOut)
	sys.stdout.flush()

def main():
	#myDB = "mongodb://localhost:27017/cisbank"
	myDB = "mongodb://cisbank:cisTable47@ds051595.mlab.com:51595/cisbank"

	bId = sys.argv[1]
	tId = sys.argv[2]
	mId = sys.argv[3]
	statusB = updateB(bId, mId, myDB)
	statusT = updateT(tId, mId, myDB)
	if statusB and statusT:
		sendResult("Success")
	else:
		sendResult("Error")

#if __name__ == "__main__":
 #   sendResult("Init")
main()