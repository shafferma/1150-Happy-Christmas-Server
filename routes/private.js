const FavoriteController = require("../controllers/FavoriteController")
const RatingController = require("../controllers/RatingController")
const UserController = require("../controllers/UserController")


module.exports = function(router) {

    // user
    router.get("/user", UserController.getList)
    router.get("/user/:username", UserController.getSingle)
    router.put("/user/:username", UserController.updateSingle)
    router.delete("/user/:username", UserController.removeSingle)

    // favorites
    router.post("/photo/:id/favorite", FavoriteController.addFavorite)
    router.delete("/photo/:id/favorite", FavoriteController.removeFavorite)
    
    // ratings
    router.post("/photo/:id/rating/:rating", RatingController.addRating)
    router.delete("/photo/:id/rating", RatingController.removeRating)

    return router
}
