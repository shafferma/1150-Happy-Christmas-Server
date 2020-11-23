// importing the sequelize package that manages the database
const Sequelize = require("sequelize");

//create our database connection
const database = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
});

//export database
module.exports = database;