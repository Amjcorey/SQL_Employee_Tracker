const inquirer = require("inquirer");
// Import and require mysql2
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    //get password from .env file
    password: process.env.DB_PASSWORD,
    database: "employees_db",
  },
  console.log(`Connected to employee database.`)
);

// Function written to prompt the user with different options to navigate the database
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
          "Update an employee manager",
          "Delete departments",
          "Delete roles",
          "Delete employees",
        ],
        name: "employeeTracker",
      },
    ])
    // Takes in user choice
    .then((response) => {
      switch (response.action) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateRole();
          break;
        case "Update an employee manager":
          updateManager();
          break;
        case "Delete departments":
          deleteDepartment();
          break;
        case "Delete roles":
          deleteRole();
          break;
        case "Delete employees":
          deleteEmployee();
          break;
      }
    });
}

// -------------- VIEW -----------------

// View all departments
function viewDepartments() {
  db.query("SELECT * FROM department", function (err, results) {
    console.table(results);
    startApp();
  });
}

// View all roles

function viewRoles() {
  db.query("SELECT * FROM role", function (err, results) {
    console.table(results);
    startApp();
  });
}

// View all employees
function viewEmployees() {
  // join salary based on role_id
  db.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, manager_id, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id",
    function (err, results) {
      console.table(results);
      startApp();
    }
  );
}

// -------------- ADD -----------------

// Add department

// Add role

// Prompts user for new role name, salary, and corresponding department

// Add employee

// Prompts user for first name, last name, role, and corresponding manager

// -------------- UPDATE -----------------

// Update an employee role
// Prompts user to select employee whose role will be updated, and new role of said employee

// Update an employee manage

// -------------- REMOVE -----------------

// Delete roles

// Delete employees

startApp();