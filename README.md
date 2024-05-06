# SQL_Employee_Tracker

Week-12 Challenge (SQL): A command line application for business owners to view, add, and manage the departments, roles, and employees within a company database.

## Installation

- Once node.js v16 is installed, in the terminal, run the command "npm init -y" to create a package.json to store project files.

- Next, in the terminal run command npm i to install the dependencies associated with this application (developers may need to install dependencies directly from the command line).
    Commands to install each dependency: 
    - sequelize: npm i sequelize 
    - mysql2: npm i mysql2 
    - dotenv: npm i dotenv 
    - inquirer: npm i inquirer@8.2.4 
    - chalk: npm i chalk

- Once all dependencies are installed, you will need to create the database. To do this you will need to navigate to the directory db directory containing the schema.sql file. Once there, you will need to open up a MySQL shell to run the command source schema.sql.    
    - To do this, navigate to the root directory and run all the files associated within the seeds folder. This needs to be done from the root directory because the.env file lives within the root. The commands will look like the following: 
    node ./seeds/departments, 
    node ./seeds/roles, 
    node ./seeds/employees


