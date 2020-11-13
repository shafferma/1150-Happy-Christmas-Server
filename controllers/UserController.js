const DB = require("../db")
const User = DB.import("../models/user")
const Session = require("../utls/session")
const Password = require("../utls/password")

module.exports = {
    register: function(request, response) {
        // we wrap our code in a try/catch incase the request doesn't contain a user object
        try {
            const {username, password} = request.body.user

            //user did not provide their username and password
            if (!username || !password) {
                response.status(400).send("Provide username and password")
                return
            }

            //check if username already exists
            let userExists = false
            User.findOne({
                where: {
                    username
                }
            }).then(user => {

                // determine if the user exists for the given username
                userExists = !!user
    
                // if username already exists, return an error
                if (userExists) {
                    console.log("user already exists")
                    response.status(400).send("Username already exists")
                    return
                }
    
                // if username doesn't exist create user
                User.create({
                    username: username,
                    passwordhash: Password.hash(password)
                }).then((user) => {
                    // generate a session token using the newly created user object
                    const token = Session.generateToken(user)
    
                    // respond to the request with the following info
                    response.status(200).send({
                        user: user,
                        message: "Account registered",
                        sessionToken: token
                    })
                    return
                })
            })

        } catch(error) {
            console.log("create user error", error)
            response.send(500, "Error")
            return
        }
    }
}