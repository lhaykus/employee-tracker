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
const updateEmployeeRoles = async () => {

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
            name: 'departmentId',
            message: 'What is the department ID for this role?',
            type: 'input',
        }
    ])
        
    } catch (error) {
        connection.end();
        
    }
}












//Function to add an employee