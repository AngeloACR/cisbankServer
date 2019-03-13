from pymongo import MongoClient
import sys

global connection

global baccs 
global taccs 
global moves 

global bacc 
global tacc 
global move 

global dOut

def connectDB(myDB):
	connection = MongoClient(myDB)
	baccs = connection.cisbank.BAcc
	taccs = connection.cisbank.TAcc
	moves = connection.cisbank.Moves

def closeConnect():
	connection.close()

def updateB(bId, mId):
	bQuery = {'bAlias': bId}
	mQuery = {'mCode': mId}
	bacc = baccs.find_one(bQuery)
	move = moves.find_one(mQuery)

	if moveSign:
		newBalance = bacc['bBalance'] + move['mAmmount']
	else:
		newBalance = bacc['bBalance'] - move['mAmmount']

	bValue = { "$set": { "bBalance": newBalance } }
	
	baccs.update_one(bQuery, bValue)

def updateT(tId, mId):
	tQuery = {'tName': tId}
	mQuery = {'mCode': mId}
	tacc = taccs.find_one(tQuery)
	move = moves.find_one(mQuery)

	newBalance = tacc['tBalance'] + move['mAmmount']

	tValue = { "$set": { "tBalance": newBalance } }
	
	taccs.update_one(tQuery, tValue)


def sendResult():
	print(dOut)
	sys.stdout.flush()

def main()
	myDB = "mongodb://localhost:27017"
	#myDB = "mongodb://angeloacr:cisbankDataBase47@ds051595.mlab.com:51595"
	connectDB(myDB)

	bId = sys.argv[1]
	tId = sys.argv[2]
	mId = sys.argv[3]

	updateB(bId, mId)
	updateT(tId, mId)
	closeConnect()
	sendResult()

if __name__ == "__main__":
    main()