const express = require('express');
const app = express();
const fs = require('fs-extra');
const bodyParser = require('body-parser');

const DB_PATH_DIR = __dirname + '/db/';
const DB_PATH_EMPLOYES_FILE_NAME = 'employes.json';
const DB_PATH_EMPLOYES = DB_PATH_DIR + DB_PATH_EMPLOYES_FILE_NAME;

const DB_TPL_EMPLOYES = JSON.stringify({data: []});

dbInit();
declareRoutes();
startServer();

//database
function dbInit() {
  //make sure db directory exists
	fs.ensureDirSync(DB_PATH_DIR, 0o2775);

  //make sure employes.json exists 
  fs.ensureFileSync(DB_PATH_EMPLOYES);

  //make sure employes.json is valid
  const parsedData = dbEmployesLoadFile(() => {
  	fs.writeFileSync(DB_PATH_EMPLOYES, DB_TPL_EMPLOYES);
  });

  if(parsedData === null) {
  	return;
  }

	parsedData.data = parsedData.data.filter(validateEmployee);
	fs.writeFileSync(DB_PATH_EMPLOYES, JSON.stringify(parsedData));
}

function dbEmployesLoadFile(errorHandler) {
	const content = fs.readFileSync(DB_PATH_EMPLOYES);

  let parsedData;
  try {
  	parsedData = JSON.parse(content);
	} catch (e) {
		errorHandler();
		return null;
	}

	if(!Array.isArray(parsedData.data)) {
		errorHandler();
		return null;
	}

	return parsedData;
}

function dbEmployeeCreate(name, position, salary, yearOfBirth) {
	//validate input
	const employee = {
		name: name,
		position: position,
		salary: salary,
		yearOfBirth: yearOfBirth,
	};

	const isValid = validateEmployee(employee);

	//throw an exeption if invalid
	if(!isValid) {
		throw {message: 'Data is invalid!!!😡'}
	}

	//read db file 
	const parsedData = dbEmployesLoadFile();
	if(parsedData === null) {
		throw {message: 'Datadase is corrupted!!!😡'}
	}

	//add new employee object to the data
	parsedData.data.push(employee);

	//write result back to the file
	fs.writeFileSync(DB_PATH_EMPLOYES, JSON.stringify(parsedData));
}

function validateEmployee(employee) {
		const isObject = typeof employee === 'object';
		if(!isObject) {
			return false;
		}
		
		const nameIsCorrect = typeof employee.name === 'string'; 
		const positionIsCoorect = typeof employee.position === 'string';
		const salaryIsCorrect = typeof employee.salary === 'number';
		const yearOfBirthIsCorrect = typeof employee.yearOfBirth === 'number';

		return nameIsCorrect && positionIsCoorect && salaryIsCorrect && yearOfBirthIsCorrect;
}

//start server
function startServer() {
	app.listen(6666, () => {
		console.log('server is started');
	});
}

//routing
function declareRoutes() {
	app.use(bodyParser.json());

	app.post('/api/v1/employes', (req, res) => {
		const validPayload = validateEmployee(req.body);
		if(!validPayload) {
			res.status(422).send({
				message: 'The input data is invalid!!!'
			});
			return;
		}

		const {name, position, salary, yearOfBirth} = req.body;
		try {
			dbEmployeeCreate(name, position, salary, yearOfBirth);
		} catch(e) {
			res.status(422).send(e);
			return;
		}
		res.status(201).send('');
	});
}
