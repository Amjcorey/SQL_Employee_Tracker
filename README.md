# SQL_Employee_Tracker
 Week-12 Challenge (SQL): A command line application for business owners to view, add, and manage the departments, roles, and employees within a company database.


## Installation

- Once node.js v16 is installed, in the terminal, run the command "npm init -y" to create a package.json to store project files.
- Next, use the terminal to run the command npm i to install the dependencies associated with this application (developers may need to install dependencies directly from the command line).

Navigate the "main" folder in the command line and execute:

- "mysql -u root -p" and enter their password. From there they should use commands
- "SOURCE db/schema.sql" and "SOURCE db/seeds.sql" to seed the data in the db folder in the tables for Employee Department Role
- Then, execute the command "node server.js" to start the application. From there, you may select from the options to view, edit, and delete: employees, departments, and roles. As well as view various associated information within each of these tables.