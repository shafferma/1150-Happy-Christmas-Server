const Session = require("../utls/session");
const DB = require("../db");
const User = DB.import("../models/user"); 

module.exports = function(request, response, next) {
    console.log('### validate :: start')
    if (request.method == "OPTIONS") {
        console.log('### validate :: method is OPTIONS')
        next()
    } else {
        console.log('### validate :: method IS NOT OPTIONS')
        const sessionToken = request.headers.token;
        console.log('### validate :: Validate Session', { sessionToken })
        if (!sessionToken) {
            return response.status(403).send({ auth: false, message: "No token provided."});
        } else {
            Session.verify(sessionToken)
                .then((user) => {
                    console.log('validated user', user.username)
                    request.user = user
                    next()
                })
                .catch((error) => {
                    console.log('error validating session', { error })
                    resoponse.status(500).send('Something went wrong validating your session.')
                })
        }
    }
}

