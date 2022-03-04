//dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");


// create the connection to mysql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootpass",
  database: "employees_db"
});


// after connecting, check for error or run first prompt function
connection.connect((err) => {
  if (err) throw err;
  console.log("========= EMPLOYEE MANAGER =========")
  mainMenu();
});

//prompts 
const mainMenu = () => {
  inquirer.prompt ([
    {
      type: 'list',
      name: 'mainmenu', 
      message: 'What would you like to do?',
      choices: ['View All Departments',
                'View All Roles',
                'View All Employees', 
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role'             
                ]
    }
  ]).then((answer) => {
    switch (answer.mainmenu) {
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'View All Roles':
        viewAllRoles();
        break;
      case 'View All Employees':
        viewAllEmployees();
        break; 
      case 'Add Department':
        console.log("4")
        break;
      case 'Add Role':
        console.log("5")
        break;
      case 'Add Employee':
        console.log("6")
        break;
      case 'Update Employee Role':
        console.log("7")
        break;

    }
  });
}

function viewAllDepartments () {
    connection.query("SELECT * FROM employees_db.department", function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

function viewAllRoles () {
  connection.query("SELECT e.id, r.title, d.name AS department, r.salary FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON d.id = r.department_id", function (err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
  });
}

function viewAllEmployees() {
  connection.query("SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON d.id = r.department_id LEFT JOIN employee m ON m.id = e.manager_id", function (err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
  });
}
