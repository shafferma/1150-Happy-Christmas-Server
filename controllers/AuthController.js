const DB = require("../db")
const User = DB.users;
const Session = require("../utls/session")
const Password = require("../utls/password")
const Values = require("../utls/values")

const INCORRECT_CREDENTIALS = "The user does not exist or the credentials were not correct.";

module.exports = {
    // handles our "user logic"
    login: function(request, response){
        try {
            const {username, password} = request.body

            User.findOne({
                raw: true,
                where: {
                    username: Values.strip(username)
                },
                attributes: [
                    'id',
                    'firstname',
                    'lastname',
                    'email',
                    'username',
                    'admin',
                    'password'
                ]
            }).then((user) => {
                // if no user respond with incorrect credts.
                if (!user) {
                    response.status(401).send({ error: INCORRECT_CREDENTIALS })
                    return 
                }

                // check that the user provided the correct password
                Password.compare(password, user.password)
                    .then((isSamePassword) => {
                        if (!isSamePassword) {
                            response.status(401).send({ error: INCORRECT_CREDENTIALS })
                            return
                        }

                        // logic to handle the token and response
                        delete user['password']
                        response.json({
                            user,
                            message: "successfully authenticated",
                            sessionToken: Session.generateToken(user)
                        });

                    })
                    .catch((error) => {
                        console.log(error)
                        response.status(401).send({ error: INCORRECT_CREDENTIALS })
                    })
            })
        
        } catch(error) {
            // this error is only sent if there is a problem with our logic above
            console.log(error)
            response.status(500).send("Server error")
        }
        
    }
}