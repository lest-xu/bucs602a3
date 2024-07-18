const employeeDB = require('../employeeDB.js');
const Employee = employeeDB.getModel();

module.exports = async (req, res, next) => {

	// Fill in the code
	// get employee id from body on edit view 
	let id = req.body.id;

	// find the employee by id
	Employee.findById(id, (error, employee) => {
		if (error) {
			console.log(`Edit Error: ${error}`);
		}
		// make sure found the employee
		if (!employee) {
			return res.render('404');
		}

		// remove the employee
		employee.remove((error) => {
			if (error) {
				console.log(`Delete Employee Error: ${error}`);
			}

			// redirect to employees view
			res.redirect('/employees');

		});
	});

};

