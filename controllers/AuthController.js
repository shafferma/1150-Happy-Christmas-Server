const DB = require("../db")
const User = DB.import("../models/user")
const Session = require("../utls/session")
const Password = require("../utls/password")

const INCORRECT_CREDENTIALS = "The user does not exist or the credentials were not correct.";

module.exports = {
    // handles our "user logic"
    login: function(request, response){
        try {
            const {username, password} = request.body.user

            User.findOne({ 
                where: {
                    username: username
                }
            }).then((user) => {
                console.log("Found User", user)
                // if no user respond with incorrect credts.
                if (!user) {
                    response.status(401).send(INCORRECT_CREDENTIALS)
                    return 
                }

                // check that the user provided the correct password
                Password.compare(password, user.passwordhash)
                    .then((isSamePassword) => {
                        console.log('Check provided password', {isSamePassword})
                        if (!isSamePassword) {
                            response.status(401).send(INCORRECT_CREDENTIALS)
                            return
                        }

                        // logic to handle the token and response
                        
                        response.json({
                            user: user,
                            message: "successfully authenticated",
                            sessionToken: Session.generateToken(user)
                        });

                    })
                    .catch((error) => {
                        console.log(error)
                        response.status(401).send(INCORRECT_CREDENTIALS)
                    })
            })
        
        } catch(error) {
            // this error is only sent if there is a problem with our logic above
            response.status(500).send("Server error")
        }
        
    }
}