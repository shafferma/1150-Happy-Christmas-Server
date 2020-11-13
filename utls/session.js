const jwt = require("jsonwebtoken")
const DB = require("../db");
const User = DB.import("../models/user"); 

module.exports = {
    // generates a token we can give to the User for handling authentication
    generateToken: function(user) {
        return jwt.sign({ id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24})
    },
    verify: function(token) {
        console.log('Session.verify()', { token })
        return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (!decoded) {
                console.log('token not decoded', { decoded })
                throw new Error('Unable to decode the session token.')
            }
            console.log('session, finding user')
            return User.findOne({where: { id: decoded.id}})
                .then(user => {
                    console.log('sesson, found user... returning    ')
                    return user
                })
                .catch((error) => {
                    console.log('Unable to find User in validate-session', { error })
                    throw new Error('Error finding user to validate session.')
                })
        })
    }
}