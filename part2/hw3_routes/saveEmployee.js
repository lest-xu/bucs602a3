const employeeDB = require('../employeeDB.js');
const Employee = employeeDB.getModel();

module.exports = async (req, res, next) => {

	// Fill in the code
	// define the employee model object from employeeDB
	let employee = Employee({
		firstName: req.body.fname, // assign the value from input
		lastName: req.body.lname
	});

	// save the employee and redirect to employees' home page
	employee.save((error) => {
		if (error) {
			console.log(`Save Error: ${error}`);
		}
		res.redirect('/employees');
	});

};
