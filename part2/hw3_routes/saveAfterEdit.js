const employeeDB = require('../employeeDB.js');
const Employee = employeeDB.getModel();

module.exports = async (req, res, next) => {

    // Fill in the code
    // get employee id from body on edit view 
    let id = req.body.id;
    
    // find the employee by id
    Employee.findById(id, (error, employee) => {
        if (error) {
            console.log(`After Edit Error: ${error}`);
        }
        // make sure found the employee
        if (!employee) {
            return res.render('404');
        }
        
        // update first and last name
        employee.firstName = req.body.fname;
        employee.lastName = req.body.lname;

        // save and redirect
        employee.save((error) => {
            if (error) {
                console.log(`Save Error: ${error}`);
            }
            res.redirect('/employees');
        });

    });

};
