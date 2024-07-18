const employeeDB = require('../employeeDB.js');
const Employee = employeeDB.getModel();

module.exports = async (req, res, next) => {

	// Fill in the code
	let employee = Employee({
		firstName: req.body.fname,
		lastName: req.body.lname
	});

	employee.save((error) => {
		if (error) {
			console.log(`Save Error: ${error}`);
		}
		res.redirect('/employees');
	});

};
