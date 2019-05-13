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


def totalizeMove(mDate, mId, myDB):
	try:
		tConnect = connectDB(myDB)

		dmoves = tConnect.cisbank.dmoves
		moves = tConnect.cisbank.moves

		dQuery = {'mDate': mDate}
		mQuery = {'mCode': mId}
		dmove = dmoves.find_one(dQuery)
		move = moves.find_one(mQuery)

		if move['mSign']:
			newDebe = dmove['mDebe'] + move['mAmmount']
			mDebe = { "$set": { "mDebe": newDebe } }
			dmoves.update_one(dQuery, mDebe)
		else:
			newHaber = dmove['mHaber'] + move['mAmmount']
			mHaber = { "$set": { "mHaber": newHaber } }
			dmoves.update_one(dQuery, mHaber)
		
		newTotal = dmove['mDebe'] - dmove['mHaber']
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

def sendResult(dOut):
	print(dOut)
	sys.stdout.flush()

def main():
	#myDB = "mongodb://localhost:27017/cisbank"
	myDB = "mongodb://cisbank:cisTable47@ds051595.mlab.com:51595/cisbank"

	mId = sys.argv[1]
	statusM = updateB(mId, myDB)
	if statusM:
		sendResult("Success")
	else:
		sendResult("Error")

#if __name__ == "__main__":
 #   sendResult("Init")
main()