# SQL_Employee_Tracker

## Week-12 Challenge (SQL)

This is content management system using Inquire@8.2.4 and MySQL2 to track employees in the command line interface. It allows the user to view, edit, add, and delete employees, a well as their department, role within that department. Additionally, it allows the user to view, edit, and delete departments and roles therein.

## Installation

- Once node.js v16 is installed, in the terminal, run the command "npm init -y" to create a package.json to store project files.

- Next, in the terminal run command npm i to install the dependencies associated with this application (developers may need to install dependencies directly from the command line).
    Commands to install each dependency: 
    - sequelize: npm i sequelize 
    - mysql2: npm i mysql2 
    - dotenv: npm i dotenv 
    - inquirer: npm i inquirer@8.2.4 

- Once all dependencies are installed, you will need to create the database. To do this you will need to navigate to the directory db directory containing the schema.sql file. Once there, you will need to open up a MySQL shell to run the command source schema.sql.
- Finally the user should execute the command "node server.js" to start the application. From there, the user may select from the options to view, edit, and delete: employees, departments, and roles. As well as view various associated information within each of these tables.    
 

![screenshot1-wk-12](<img/Screenshot 2024-05-06 003029.png>)