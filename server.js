const express = require('express');
const app = express();
const fs = require('fs-extra');

const DB_PATH_DIR = __dirname + '/db/';
const DB_PATH_EMPLOYES_FILE_NAME = 'employes.json';
const DB_PATH_EMPLOYES = DB_PATH_DIR + DB_PATH_EMPLOYES_FILE_NAME;

dbInit();
//startServer();

//database
function dbInit() {
  //make sure db directory exists
	fs.ensureDirSync(DB_PATH_DIR, 0o2775);

  //make sure employes.json exists 
  fs.ensureFileSync(DB_PATH_EMPLOYES);

  //make sure employes.json is valid
  const content = fs.readFileSync(DB_PATH_EMPLOYES);

  try {
  	const parsedData = JSON.parse(content);
	} catch (e) {
		fs.writeFileSync(DB_PATH_EMPLOYES, '{}');
	}

}

//start server
function startServer() {
	app.listen(6666, () => {
		console.log('server is started');
	});
}


//routing
