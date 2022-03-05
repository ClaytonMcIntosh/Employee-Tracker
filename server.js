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
        addDepartment();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Employee':
        addEmployee();
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
  connection.query("SELECT e.id, r.title, d.name AS department, r.salary FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON d.id = r.department_id", function (err, res) {
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

function addDepartment() {
  inquirer
  .prompt({
    type: 'input',
    name: 'proptDepartment',
    message: 'What is the name of the department?',
  })
  .then(answer => {
    var query = connection.query(
        "INSERT INTO department (name) VALUES (?)", answer.proptDepartment, (err) => {
            if (err) throw err;
            console.log("Added " + answer.proptDepartment + " to the database");
            mainMenu();
        }
    )
})
}

function addRole() {
  connection.query("SELECT * FROM employees_db.department", function (err, result) {
    let departments = result;
    const departmentChoices = departments.map(dep => {
      return {
        name: dep.name,
        value: dep.id
      }
    })
  inquirer
    .prompt([{
      type: 'input',
      name: 'title',
      message: 'What is the name of the role?',
    }, {
      type: 'input',
      name: 'salary',
      message: 'What is the salary of the role?',
    },
    {
      type: "list",
      name: "department_id",
      message: "Which department does the role belong to?",
      choices: departmentChoices
    }])
    .then(answer => {
      var query = connection.query(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.title, answer.salary, answer.department_id], (err) => {
          if (err) throw err;
          console.log("Added " + answer.title + ", " + answer.salary + ", and " + answer.department_id + " to the database");
          mainMenu();
        }
      )
    })
  })
}

function addEmployee() {
  connection.query("SELECT * FROM employees_db.role", function (err, result) {
    let roles = result;
    const roleChoices = roles.map(rol => {
      return {
        name: rol.title,
        value: rol.department_id
      }
    });


  inquirer
    .prompt([{
      type: 'input',
      name: 'first_name',
      message: "What is the employee's first name?",
    }, {
      type: 'input',
      name: 'last_name',
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "role",
      message: "What is the employee's role?",
      choices: roleChoices
    }])
    .then(answer => {
      var query = connection.query(
        "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)", [answer.first_name, answer.last_name, answer.role], (err) => {
          if (err) throw err;
          console.log("Added " + answer.first_name + ", " + answer.last_name + ", and " + answer.role_id + " to the database");
          mainMenu();
        }
      )
    })
  })
}