const inquirer = require("inquirer");
// Import and require mysql2
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    //Retrieve password from .env 
    password: process.env.DB_PASSWORD,
    database: "employees_db",
  },
  console.log(`Connected to employee database.`)
);

// db.connect(function (err) {
//   if (err) throw err;
//   console.log("connected!");
// });

// Function written to prompt user with different options to navigate the database on start
function startApp() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "Select a database",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "Delete Department",
          "Delete Role",
          "Delete Employee",
        ],
        name: "employeeTracker",
      },
    ])

    // Takes in user choice
    
    .then((answers) => {
      switch (answers.action) {
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "Update Employee Manager":
          updateManager();
          break;
        case "Delete Department":
          deleteDepartment();
          break;
        case "Delete Role":
          deleteRole();
          break;
        case "Delete Employee":
          deleteEmployee();
          break;
      }
      return;
    });
}

// -------------- VIEW -----------------

// View all departments
function viewDepartments() {
  db.query("SELECT * FROM department", function (results) {
    console.table(results);
    startApp();
  });
}

// View all roles
function viewRoles() {
  db.query("SELECT * FROM role", function (results) {
    console.table(results);
    startApp();
  });
}

// View all employees
function viewEmployees() {
  // join salary based on role_id
  db.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, manager_id, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id",
    function (results) {
      console.table(results);
      startApp();
    }
  );
}

// -------------- ADD -----------------

// Add department
function addDepartment() {
  // Prompts user for name of new department
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What department would you like to add?",
      },
    ])
    .then((answers) => {
      // Takes in user input
      db.query(
        "INSERT INTO department SET ?",
        { name: answers.department },
        function (results) {
          console.log("Department added.");
          viewDepartments();
        }
      );
    });
}

// Add role
function addRole() {
  db.query("SELECT * FROM department", function (results) {
    const departmentList = results.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });
    // Prompts user for role name, salary, and corresponding department

    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What role would you like to add?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary for this role?",
        },
        {
          type: "list",
          name: "department_id",
          message: "What is the department ID for this role?",
          choices: departmentList,
        },
      ])
      .then((answers) => {
        db.query(
          "INSERT INTO role SET ?",
          {
            title: answers.title,
            salary: answers.salary,
            department_id: answers.department_id,
          },
          function (results) {
            console.log("Role added.");
            viewRoles();
          }
        );
      });
  });
}

// Add employee
function addEmployee() {
  db.query("SELECT * FROM role", function (results) {
    const roleList = results.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });
    inquirer
      .prompt([
        // Prompts user for first name, last name, role, and corresponding manager
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?",
        },
        {
          type: "list",
          name: "role_id",
          message: "What is the employee's role ID?",
          choices: roleList,
        },
      ])
      .then((answers) => {
        // Takes in user input
        db.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answers.first_name,
            last_name: answers.last_name,
            role_id: answers.role_id,
          },
          function (results) {
            console.log("Employee added.");
            viewEmployees();
          }
        );
      });
  });
}

// -------------- UPDATE -----------------

// Update employee role
function updateRole() {
  db.query("SELECT * FROM employee", function (results) {
    const employeeList = results.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    db.query("SELECT * FROM role", function (results) {
      const roleList = results.map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      });
      // Prompts user to select employee to update and new role
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee_id",
            message: "Which employee would you like to update?",
            choices: employeeList,
          },
          {
            type: "list",
            name: "role_id",
            message: "What is the employee's new role?",
            choices: roleList,
          },
        ])
        .then((answers) => {
          db.query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [answers.role_id, answers.employee_id],
            function (results) {
              console.log("Employee role updated.");
              startApp();
            }
          );
        });
    });
  });
}

// Update an employee manager
function updateManager() {
  db.query("SELECT * FROM employee", function (results) {
    const employeeList = results.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee_id",
          message: "Which employee would you like to update?",
          choices: employeeList,
        },
        {
          type: "input",
          name: "manager_id",
          message: "What is the employee's new manager ID?",
        },
      ])
      .then((answers) => {
        // Take in user input
        db.query(
          "UPDATE employee SET manager_id = ? WHERE id = ?",
          [answers.manager_id, answers.employee_id],
          function (results) {
            console.log("Employee manager updated.");
            startApp();
          }
        );
      });
  });
}

// -------------- REMOVE -----------------

// Delete departments
function deleteDepartment() {
  db.query("SELECT * FROM department", function (results) {
    const departmentList = results.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          message: "Which department would you like to delete?",
          choices: departmentList,
        },
      ])
      .then((answers) => {
        db.query(
          "DELETE FROM department WHERE id = ?",
          answers.id,
          function (results) {
            console.log("Department deleted.");
            startApp();
          }
        );
      });
  });
}

// Delete roles

function deleteRole() {
  db.query("SELECT * FROM role", function (results) {
    const roleList = results.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          message: "Which role would you like to delete?",
          choices: roleList,
        },
      ])
      .then((answers) => {
        db.query(
          "DELETE FROM role WHERE id = ?",
          answers.id,
          function (results) {
            console.log("Role successfully deleted.");
            startApp();
          }
        );
      });
  });
}

// Delete employees
function deleteEmployee() {
  db.query("SELECT * FROM employee", function (results) {
    const employeeList = results.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          message: "Which employee would you like to delete?",
          choices: employeeList,
        },
      ])
      .then((answers) => {
        db.query(
          "DELETE FROM employee WHERE id = ?",
          answers.id,
          function (results) {
            console.log("Employee successfully deleted.");
            startApp();
          }
        );
      });
  });
}

startApp();
