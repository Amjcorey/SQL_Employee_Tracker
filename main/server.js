const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
require ('dotenv').config();

const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        //get password from .env file
        password: process.env.DB_PASSWORD,
        database: 'employees_db'
    },
    console.log(`Connected to employee database.`)
);

// Function written to prompt the user with different options to navigate the database


// -------------- VIEW -----------------

// View all departments

// View all roles

// View all employees

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