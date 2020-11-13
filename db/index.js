// importing the sequelize package that manages the database
const Sequelize = require("sequelize");

/**
 *  Databse conncetion details
 *  */
const DB_HOST = process.env.DB_HOST //where to connect
const DB_USER = process.env.DB_USER // db username
const DB_PASS = process.env.DB_PASS // db password
const DB_NAME = process.env.DB_NAME 

//create our database connection
const database = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: 'postgres'
})

//export database
module.exports = database;