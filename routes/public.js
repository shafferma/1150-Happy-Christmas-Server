const UserController = require("../controllers/UserController")
const AuthController = require("../controllers/AuthController")
const PhotoController = require("../controllers/PhotoController")

module.exports = function(router) {
    router.post("/register", UserController.register)
    router.post("/login", AuthController.login)
    router.get("/photos", PhotoController.getList)
    return router
}
