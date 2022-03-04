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
  firstPrompt();
});

//prompts 
const firstPrompt = () => {
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
        console.log("1")
        break;
      case 'View All Roles':
        console.log("2")
        break;
      case 'View All Employees':
        console.log("3")
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