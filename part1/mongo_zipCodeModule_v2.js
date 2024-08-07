const { MongoClient, ServerApiVersion } = require("mongodb");
const credentials = require("./credentials.js");
const dbUrl = `mongodb+srv://${credentials.username}:${credentials.password}@${credentials.host}/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(dbUrl, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useFindAndModify: true,
		useCreateIndex: true
	},
});

module.exports.connect = async () => {
	try {
		await client.connect();
	} catch {
		console.log("Tried opening the connection...");
	}
};

module.exports.disconnect = async () => {
	try {
		await client.close();
	} catch {
		console.log("Tried closing the connection.");
	}
};

module.exports.lookupByZipCode = async (zip) => {
	let collection = client.db(credentials.database).collection("zipcodes");
	let result = await collection.find({ _id: zip }).toArray();

	if (result.length > 0) return result[0];
	else return undefined;
};

// Complete the code for the following

module.exports.lookupByCityState = async (city, state) => {
	let collection = client.db(credentials.database).collection("zipcodes");
	// Fill in the rest
	let result = await collection.find({ city: city, state: state }).toArray();

	// define the return object
	let resultObj = {
		'city': city,
		'state': state,
		'data': result ? result.map(i => ({ zip: i._id, pop: i.pop })) : []
	}

	return resultObj;
};

module.exports.getPopulationByState = async (state) => {
	let collection = client.db(credentials.database).collection("zipcodes");

	// Fill in the rest
	let result = await collection.find({ state: state }).toArray();
	
	// get total pop by state
	const totalPop = result.reduce((pop, item) => {
		if (item.state === state) {
			return pop + item.pop;
		}
		return pop;
	}, 0);

	// create the result obejct for return
	const resultObj = {
		'state': state,
		'pop': totalPop
	};
	
	return resultObj;
};
