//Required packages
const mysql = require('mysql');
const inquirer = require('inquirer');




//Create a connection 
const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'password',

    database: 'employee_db',
});



connection.connect((err) => {
    if (err) throw err;
    start();
});


//Starting function to ask user what they want to do 
const start = () => {
    inquirer.prompt({
        name: 'userOption',
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Update employee roles',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Exit',
        ],
    })
    //Depending on what option user picks, a function will be called to present what the user chose
        .then((answer) => {
            switch (answer.userOption) {
                case 'View all departments':
                    getAllDepartments();
                    break;

                case 'View all roles':
                    getAllRoles();
                    break;

                case 'View all employees':
                    getAllEmployees();
                    break;

                case 'Update employee roles':
                    updateEmployeeRoles();
                    break;

                case 'Add a department':
                    addDepartment();
                    break;

                case 'Add a role':
                    addRole();
                    break;

                case 'Add an employee':
                    addEmployee();
                    break;

                case 'Exit':
                //Ends the connection and exists out of the commnad line
                    connection.end();
            };
        });
};


//Function to get all the employess
const getAllEmployees = async () => {
    //Selecting all from the employee table 
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        //For each employee add their ID, first and last name, the department ID and manager ID
        res.forEach(employee => {
            console.log(`ID: ${employee.id} -- Name: ${employee.first_name} ${employee.last_name} -- Role ID: ${employee.role_id} -- Manager ID: ${employee.manager_id}`);
        });
        //Return to the starting function 
        start();
    });
};


//Function to show all departments
const getAllDepartments = async () => {
    //Selecting all from the department table
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        //For each department add their name
        res.forEach(department => {
            console.log(department.name);
        });
        //Return to the starting function 
        start();
    });
};

//Function to show all roles
const getAllRoles = async () => {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        //For each role add their title, salary, and department_id
        res.forEach(roles => {
            console.log(`Title: ${roles.title} -- Yearly Salary: ${roles.salary} --Department ID: ${roles.department_id} `);
        });
        //Return to the starting function 
        start();
    });
};


//Function to update employee role
//Have to verify what employee they want to change role for and then grab role_id and change it 
const updateEmployeeRoles = async () => {
    connection.query('SELECT last_name from employee', async (err, res) => {
        try {
            //Asking what last name they want to change
            const { last_name } = await inquirer.prompt([
                {
                    name: 'last_name',
                    message: 'What is the last name of the employee you want to change the role ID for?',
                    type: 'list',
                    //.map to display an array holding the last names
                    choices: res.map(({ last_name }) => last_name),

                }
            ]);

            //Asking what they would like the new role id to be
            const { role_id } = await inquirer.prompt([
                {
                    name: 'role_id',
                    message: 'What would you like to update the role ID number to (Use numbers only) ?',
                    type: 'input',
                }
            ]);
            //updating employee to entered role id where the last name = to the last name user chose 
            const query = 'UPDATE employee SET role_id =? WHERE last_name =?';
            //parseInt turns string into interger so role_id will be a number
            connection.query(query, [parseInt(role_id), last_name], (err, res) => {
                if (err) throw err;
                console.log(`Role updated for ${last_name} to Role ID: ${role_id}`)
            })
            //Show all employees including the role_id that was updated
            getAllEmployees();


        } catch (error) {
            console.log(error);
            connection.end();

        }
    })

}

//Function to add new department 
const addDepartment = async () => {
    try {
        //Asking what new department the user would like to add using inquirer.prompt
        const { name } = await inquirer.prompt([
            {
                name: 'name',
                message: 'What department would you like to add?',
                type: 'input',
            },
        ])
        //Inserting into the department table whatever the user put as their answer = ?
        const query = 'INSERT INTO department (name) VALUES (?)';
        connection.query(query, [name], (err, res) => {
            if (err) throw err;
            console.log(`New department`, res);

        });
        //Showing all the departments including the ones that were just added
        getAllDepartments();

    } catch (error) {
        //If an error occurs, end the connection and start over
        connection.end();

    };

};

//Function to add a new role
const addRole = async () => {
    try {
        const { title, salary, department_id } = await inquirer.prompt([
            {
                name: 'title',
                message: 'What is the name of the role being added?',
                type: 'input',
            }, {
                name: 'salary',
                message: 'What is the yearly salary for this role?',
                type: 'input',
            }, {
                name: 'department_id',
                message: 'What is the department ID for this role? (Numbers only)',
                type: 'input',
            }
        ])
        //Inserting new role into roles table 
        const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
        //parseFloat turns strings to decimals for the salary
        //parseInt turns strings to intergers for the id
        connection.query(query, [title, parseFloat(salary), parseInt(department_id)], (err, res) => {
            if (err) throw err;
            console.log(`Title: ${res.title} -- Yearly Salary ${res.salary} --Department ID ${res.department_id}`);
        });
        //Showing all the roles including those which were just added
        getAllRoles();

    } catch (error) {
        connection.end();

    }
}

//Function to add an employee
const addEmployee = async () => {
    try {
        //Deconstructing what makes up the employee (first name, last name, role id and manager id)
        //Asking questions for new employee
        const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
            {
                name: 'first_name',
                message: 'What is the first name of the employee you want to add?',
                type: 'input',
            }, {
                name: 'last_name',
                message: 'What is the last name of the employee?',
                type: 'input',
            }, {
                name: 'role_id',
                message: 'What is the role ID number for new employee? (use numbers only)',
                type: 'input',
            }, {
                name: 'manager_id',
                message: 'What is the manager id for the new employee (use numbers only)',
                type: 'input',
            }
        ])
        //Inserting the info the user gave into the employee table 
        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
        connection.query(query, [first_name, last_name, parseInt(role_id), parseInt(manager_id)], (err, res) => {
            if (err) throw err;
            console.log(`First Name: ${res.first_name} --Last Name: ${res.last_name} --Role ID: ${res.role_id} --Manager ID: ${res.manager_id}`);

        });
        //Shows all the employee including those that were just included 
        getAllEmployees();

    } catch (error) {
        //If error end the connection 
        connection.end();

    }
}