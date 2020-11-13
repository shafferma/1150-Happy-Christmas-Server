// retrieve Enviornment variables from our ".env" file
require("dotenv").config();

// import the "express " framework for creating our server
const express = require("express")

// create our server application
const app = express();

// allows client to make calls to api server
const cors = require("cors");
app.use(cors())

//import our database 
const database = require("./db")

// initilize database
database.authenticate()
    // after initilzations    
    .then(() => {
        console.log(`Connected to the ${process.env.DB_NAME} database.`)
        database.sync()
        // database.sync({force: true}) // resets tables
    })

// middleware: tells our application to parse requsts as JSON
app.use(express.json());
//tells our application what "request headers" are allowed
app.use(require("./middleware/headers"));


/**
 Setup our router, this handles our "endpoints".
 Our endpoints to Controller functions
 Our controllers use our models.
 Models interact with the DB.
*/

// create our routers
const publicRouter = express.Router()
const privateRouter = express.Router()

// import our routers
const publicRoutes = require("./routes/public")
const privateRoutes = require("./routes/private")

// register our public routes using our public router
app.use("/api", publicRoutes(publicRouter))
 
// register our "validate-session" middleware on our private 
// router the following routes will require a token
privateRouter.use(require('./middleware/validate-session'))

// register our private routes with our private router
app.use("/api", privateRoutes(privateRouter))


// our server application is running
app.listen(process.env.SERVER_PORT, function() {
    console.log(`Application running on ${process.env.DB_HOST}:${process.env.SERVER_PORT}`)
})