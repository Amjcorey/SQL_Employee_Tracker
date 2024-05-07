// Connects JavaScript and Sequelize

const sequelize = require("sequelize");
require("dotenv").config();

sequelize.connect (
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "127.0.0.1",
    user: "root",
    password: process.env.DB_PASSWORD,
    dialect: "mysql",
    port: 3306,
  },
  db.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the employee database!");
  })
);

module.exports = sequelize;

// const mysql = require("mysql2");
// const db = mysql.createConnection(
//   {
//     //Retrieve password from .env
//     database: "employees_db",
//   },
//   console.log(`Connected to employee database.`)
// );
// });
