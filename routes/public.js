const UserController = require("../controllers/UserController")
const AuthController = require("../controllers/AuthController")

module.exports = function(router) {
    router.post("/register", UserController.register)
    router.post("/login", AuthController.login)
    return router
}
