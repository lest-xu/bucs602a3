const employeeDB = require('../employeeDB.js');
const Employee = employeeDB.getModel();

module.exports = async (req, res, next) => {

	// Fill in the code
	// get employee id from params on edit view 
	let id = req.params.id;

	// find the employee by id
	Employee.findById(id, (error, employee) => {
		if (error) {
			console.log(`Edit Error: ${error}`);
		}
		// make sure found the employee
		if (!employee) {
			return res.render('404');
		}

		// render to delete employee view
		res.render('deleteEmployeeView', {title: 'Confirm deleting employee',data: {
			id: id,
			firstName: employee.firstName,
			lastName: employee.lastName
		}});
		
	});

};

