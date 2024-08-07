const express = require('express');
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setup handlebars view engine
const handlebars = require('express-handlebars');

app.engine('handlebars',
	handlebars({ defaultLayout: 'main' }));

app.set('view engine', 'handlebars');

// static resources
app.use(express.static(__dirname + '/public'));

// Use the employee module
const cities = require('./mongo_zipCodeModule_v2');

// GET request to the homepage

app.get('/', function (req, res) {
	res.render('homeView');
});

app.get('/zip', async function (req, res) {
	if (req.query.id) {
		let id = req.query.id;
		let result = await cities.lookupByZipCode(id);
		res.render('lookupByZipView', result);
	} else {
		res.render('lookupByZipForm');
	}
});

app.post('/zip', async function (req, res) {
	let id = req.body.id;
	let result = await cities.lookupByZipCode(id);
	res.render('lookupByZipView', result);
});


app.get('/zip/:id', async function (req, res) {
	let id = req.params.id;
	let result = await cities.lookupByZipCode(id);
	
	res.format({

		'application/json': function () {
			res.json(result);
		},

		'application/xml': function () {
			let resultXml =
				'<?xml version="1.0"?>\n' +
				'<zipCode id="' + result._id + '">\n' +
				'   <city>' + result.city + '</city>\n' +
				'   <state>' + result.state + '</state>\n' +
				'   <pop>' + result.pop + '</pop>\n' +
				'</zipCode>\n';


			res.type('application/xml');
			res.send(resultXml);
		},

		'text/html': function () {
			res.render('lookupByZipView', result);

		}
	});
});


// Complete the code for the following

app.get('/city', async function (req, res) {
	// get city and state from query url
	const city = req.query.city;
	const state = req.query.state;
	if (city && state) {
		// get result by city and state
		const result = await cities.lookupByCityState(city.toUpperCase(), state.toUpperCase());
		if (result.data.length > 0) {
			res.render('lookupByCityStateView', result); // render view
		} else {
			// no data found 
			res.status(404);
			res.render('404');
		}

	} else {
		res.render('lookupByCityStateForm'); // not present render lookupByZipForm
	}

});

app.post('/city', async function (req, res) {
	// get city and state from form's request body
	const city = req.body.city;
	const state = req.body.state;
	// get result by city and state
	const result = await cities.lookupByCityState(city.toUpperCase(), state.toUpperCase());
	// check result
	if (result.data.length > 0) {
		res.render('lookupByCityStateView', result); // render view
	} else {
		// no results found 
		res.status(404);
		res.render('404');
	}

});

app.get('/city/:city/state/:state', async function (req, res) {
	// get city and state from the params
	const city = req.params.city;
	const state = req.params.state;
	// get result by city and state
	const result = await cities.lookupByCityState(city.toUpperCase(), state.toUpperCase());

	// make sure the result is found
	if (result.data.length > 0) {

		res.format({

			'application/json': function () {
				res.json(result);
			},

			'application/xml': function () {
				// define the xml format
				let resultXml = `<?xml version="1.0"?>
					<cityState city="${result.city}" state="${result.state}">
				`;
				// loop the data add entry to xml
				result.data.forEach(item => {
					resultXml += `<entry zip="${item.zip}" pop="${item.pop}" />`;
				});
				// add closing tag for xml
				resultXml += "</cityState>";


				res.type('application/xml');
				res.send(resultXml);
			},

			'text/html': function () {
				res.render('lookupByCityStateView', result);

			}
		});
	} else {
		res.status(404).send('Not found.');
	}

});

app.get('/pop', async function (req, res) {
	// get state from query url
	const state = req.query.state;

	// check if state exist
	if (state) {
		// get population by state
		const result = await cities.getPopulationByState(state);
		// make sure result is found
		if (result.pop) {
			res.render('populationView', result); // render view
		} else {
			// no results found 
			res.status(404);
			res.render('404');
		}
	} else {
		res.render('populationForm'); // no sate present render populationForm
	}


});

app.get('/pop/:state', async function (req, res) {
	// get the state from the params
	const state = req.params.state;
	// get result by state
	const result = await cities.getPopulationByState(state.toUpperCase());
	
	// make sure the result is found
	if (result) {
		// check the header JSON, XML, & HTML formats
		const header = req.headers.accept;

		if (header.includes('application/json')) {
			res.json(result); // send json result
		} else if (header === 'application/xml') {

			// define the xml format
			let xml = `<?xml version="1.0"?>
			<statePop state="${result.state}">
				<pop/>${result.pop}</pop>
			</statePop>
		`;

			res.type('application/xml');
			res.send(xml); // send xml result
		} else {
			// make sure found the result
			if (result.pop > 0) {
				res.render('populationView', result); // render HTML view
			} else {
				// no results found 
				res.status(404);
				res.render('404');
			}
		}
	} else {
		res.status(404).send('Not found.');
	}

});


app.use(function (req, res) {
	res.status(404);
	res.render('404');
});

app.listen(3000, function () {
	console.log('http://localhost:3000');
});




