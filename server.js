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


// after connecting, display title and run first prompt function
connection.connect((err) => {
  if (err) throw err;
  console.log("========= EMPLOYEE MANAGER =========")
  mainMenu();
});

//main menu prompts
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
        updateEmployeesRole();
        break;

    }
  });
}

//display a table of all departments using sql
function viewAllDepartments () {
    connection.query("SELECT * FROM employees_db.department", function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

//display a table of all roles using sql
function viewAllRoles () {
  connection.query("SELECT r.id, r.title, d.name AS department, r.salary FROM department d LEFT JOIN role r ON d.id = department_id", function (err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
  });
}

//display a table of all employees using sql. Note that I am getting info from different tables
function viewAllEmployees() {
  connection.query("SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON d.id = r.department_id LEFT JOIN employee m ON m.id = e.manager_id", function (err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
  });
}

//adding a departments using sql
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

//adding a role using sql
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

//adding an employee using sql
function addEmployee() {
  connection.query("SELECT * FROM employees_db.role", function (err, result) {
    let roles = result;
    const roleChoices = roles.map(rol => {
      return {
        name: rol.title,
        value: rol.id
      }
    });

    connection.query("SELECT * FROM employees_db.employee", function (err, result) {
      let employees = result;
      const managerChoices = employees.map(emp => {
        return {
          name: emp.first_name,
          value: emp.id
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
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employee's manager?",
      choices: managerChoices,
    }
  ])
    .then(answer => {
      var query = connection.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.first_name, answer.last_name, answer.role, answer.manager], (err) => {
          if (err) throw err;
          console.log("Added " + answer.first_name + ", " + answer.last_name + ", and " + answer.role_id + " to the database");
          mainMenu();
        }
      )
    })
  })
})}

//updating an employee's role using sql
function updateEmployeesRole() {
      connection.query("SELECT * FROM employees_db.employee", function (err, result) {
        let employees = result;
        const employeeChoices = employees.map(emp => {
          return {
            name: emp.first_name,
            value: emp.id
          }
        });
  
        connection.query("SELECT * FROM employees_db.role", function (err, result) {
          let roles = result;
          const roleChoices = roles.map(rol => {
            return {
              name: rol.title,
              value: rol.id
            }
          });


    inquirer
      .prompt([{
        type: "list",
        name: "employee_update",
        message: "Which employee's role do you want to update?",
        choices: employeeChoices,
      }, 
      {
        type: "list",
        name: "role",
        message: "What is the employee's new role?",
        choices: roleChoices
      },
        ])
      .then(answer => {
        var query = connection.query(
          "UPDATE employee SET role_id = ? WHERE id = ? ",
          [answer.role, answer.employee_update], (err) => {
            if (err) throw err;
            console.log("Updated role");
            mainMenu();
          }
        )
      })
    })
    })}