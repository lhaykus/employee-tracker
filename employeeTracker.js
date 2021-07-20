//Required packages
const mysql = require('mysql');
const inquirer = require('inquirer');
const { async } = require('rxjs');


//Create a connection 
const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'password',
    database: 'employee_db',
});

//Creating first question to ask user to see what action they would like to take
connection.connect(async (err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}/n`);
    try {
        const userChoice1 = await inquirer.prompt([
            {
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
                    'Exit'
                ],
            },
        ]);
        doWhatUserPicks(userChoice1.userOption);
    } catch (error) {
        console.log(error);

    }
});

//Function based on users choice to call another function to do action
const doWhatUserPicks = async (userChoice) => {
    if (userChoice === 'View all employees') {
        getAllEmployees();
    };

    if (userChoice === 'View all departments') {
        getAllDepartments();
    };

    if (userChoice === 'View all roles') {
        getAllRoles();
    };

    if (userChoice === 'Update employee roles') {
        updateEmployeeRoles();

    };

    if (userChoice === 'Add a department') {
        addDepartment();

    };
    if (userChoice === 'Add a role') {
        addRole();
    };

    if (userChoice === 'Add an employee') {
        addEmployee();
    };

    if(userChoice === 'Exit') {
        connection.end();
    }
};

//Function to get all the employess
const getAllEmployees = async () => {
    //Selecting all from the employee table 
  connection.query('SELECT * FROM employee', (err, res) => {
      if(err) throw err;
      console.log(`Employee: `);
      //For each employee add their ID, first and last name, the department ID and manager ID
      res.forEach(employee => {
          console.log(`ID: ${employee.id} -- Name: ${employee.first_name} ${employee.last_name} -- Role ID: ${employee.role_id} -- Manager ID: ${employee.manager_id}`);
      });
      //Return to the starting function 
      doWhatUserPicks();
  });
};


//Function to show all departments
const getAllDepartments = async () => {
    //Selecting all from the department table
    connection.query('SELECT * FROM department', (err,res )=> {
        if (err) throw err;
       //For each department add their name
        res.forEach(department => {
            console.log(department.name);
        });
        doWhatUserPicks();
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
        doWhatUserPicks();
    });
};


//Function to update employee role
//Have to verify what employee they want to change role for and then grab role_id and change it 
const updateEmployeeRoles = async () => {
    connection.query('SELECT last_name from employee', async (err, res) => {
        try {
        //Asking what last name they want to change
        const { last_name } = await inquirer.prompt ([ 
            {
                name: 'last_name',
                message: 'What is the last name of the employee you want to change the role of?',
                type: 'list',
                //.map to create a new array holding the last names
                choices: res.map(({last_name}) => last_name),
                
            }
            
        ]);
        //Asking what they would like the new role id to be
        const { role_id } = await inquirer.prompt ([ 
            {
                name: 'role_id', 
                message: 'What would you like to update the role id to?',
                 type: 'input',
            }
        ]);
        //updating employee to entered role id where the last name = to the last name user chose 
        const query = 'UPDATE employee SET role_id =? WHERE last_name =?';
        connection.query(query, [parseInt(role_id), last_name], (err, res) => {
            if(err) throw err;
            console.log(`Role updated for ${last_name} to Role ID: ${role_id}`)
        })

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
    const { name } = await inquirer.prompt ([
        {
            name:'name',
            message: 'What department would you like to add?',
            type: 'input',
        },
    ])
    //Inserting into the department table whatever the user put as their answer = ?
    const query = 'INSERT INTO department (name) VALUES (?)';
    connection.query(query, [name],(err,res) => {
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

//Function to add a role
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
            message: 'What is the department ID for this role?',
            type: 'input',
        }
    ])
    const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
    connection.query(query, [title, parseFloat(salary), parseInt(department_id)], (err, res) => {
        if(err) throw err;
        console.log(`Title: ${res.title} -- Yearly Salary ${res.salary} --Department ID ${res.department_id}`);
    });
    getAllRoles();
        
    } catch (error) {
        connection.end();
        
    }
}

//Function to add an employee
const addEmployee = async () => {
    try {
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        {
            name: 'first_name',
            message: 'What is the first name of the employee you want to add?',
            type: 'input',
        }, {
            name: 'last_name',
            message: 'What is the last name of the employee?',
            type:'input',
        }, {
            name: 'role_id',
            message: 'What is the role Id for new employee?',
            type: 'input', 
        }, {
            name: 'manager_id',
            message: 'What is the manager id for the new employee',
            type: 'input',
        }
    ])
    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    connection.query(query, [first_name, last_name, parseInt(role_id), parseInt(manager_id)], (err, res) => {
        if (err) throw err;
        console.log(`First Name: ${res.first_name} --Last Name: ${res.last_name} --Role ID: ${res.role_id} --Manager ID: ${res.manager_id}`);

    });
    getAllEmployees();
        
    } catch (error) {
        connection.end();
        
    }
}