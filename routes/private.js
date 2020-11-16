const FavoriteController = require("../controllers/FavoriteController")
const RatingController = require("../controllers/RatingController")


module.exports = function(router) {
    /*
        router.get("/photos") // returns a list of photos
        router.get("/photo/:id") // returns a single photo
        router.get("/photo/:id/user") // returns a user that owns the photo `{ id: '', name: '',}`
        
        router.get("/users") // returns a list of users
        router.get("/user/:id") // returns a single user
        router.get("/user/:id/photos") // returns a list of photos beloning to the user
    */

    router.post("/photo/:id/favorite", FavoriteController.addFavorite)
    router.delete("/photo/:id/favorite", FavoriteController.removeFavorite)
    router.post("/photo/:id/rating/:rating", RatingController.addRating)
    router.delete("/photo/:id/rating", RatingController.removeRating)
    // router.delete("/favorite/:id", FavoriteController.removeFavorite)

    return router
}
