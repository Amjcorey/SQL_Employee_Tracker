const { Department, Role, Employee } = require("./lib");
const db = require("./config/connection");
const inquirer = require("inquirer");
const mysqlServer = require("mysql-server");

// Syncs the database with created models
sequelize.sync({ force: false }).then(() => {
  init();
});

// Function written to prompt user with different options to navigate the database on start
// initiate the program with main prompt
async function init() {
  await inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "Select a database to view or make changes",
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
          "Delete Employee(s)",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
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
      return;
    });
}

// -------------- VIEW -----------------

// View all departments
function viewDepartments() {
  db.query("SELECT * FROM department", function (err, results) {
    console.table(results);
    init();
  });
}

// View all roles
function viewRoles() {
  db.query("SELECT * FROM role", function (err, results) {
    console.table(results);
    init();
  });
}

// View all employees
function viewEmployees() {
  // join salary based on role_id
  db.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, manager_id, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id",
    function (results) {
      console.table(results);
      init();
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
        function (err, results) {
          console.log("Department added.");
          viewDepartments();
        }
      );
    });
}

// Add role
function addRole() {
  db.query("SELECT * FROM department", function (err, results) {
    const departmentList = results.map(department => {
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
  db.query("SELECT * FROM role", function (err, results) {
    const roleList = results.map(role => {
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
  db.query("SELECT * FROM employee", function (err, results) {
    const employeeList = results.map(employee => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    db.query("SELECT * FROM role", function (err, results) {
      const roleList = results.map(role => {
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
            function (err, results) {
              console.log("Employee role updated.");
              init();
            }
          );
        });
    });
  });
}

// Update an employee manager
function updateManager() {
  db.query("SELECT * FROM employee", function (err, results) {
    const employeeList = results.map(employee => {
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
          function (err, results) {
            console.log("Employee manager updated.");
            init();
          }
        );
      });
  });
}

// -------------- REMOVE -----------------

// Delete departments
function deleteDepartment() {
  db.query("SELECT * FROM department", function (err, results) {
    const departmentList = results.map(department => {
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
          function (err, results) {
            console.log("Department deleted.");
            init();
          }
        );
      });
  });
}

// Delete roles

function deleteRole() {
  db.query("SELECT * FROM role", function (err, results) {
    const roleList = results.map(role => {
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
          function (err, results) {
            console.log("Role successfully deleted.");
            init();
          }
        );
      });
  });
}

// Delete employees
function deleteEmployee() {
  db.query("SELECT * FROM employee", function (err, results) {
    const employeeList = results.map(employee => {
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
          function (err, results) {
            console.log("Employee deleted.");
            init();
          }
        );
      });
  });
}

init();
