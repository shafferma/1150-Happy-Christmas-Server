const DB = require("../db");
const Favorite = DB.import("../models/favorite");

module.exports = {
  addFavorite: function (request, response) {
    try {
      // 1. check if user already has a favorite
      // 2. if yes, return error
      // 3. else, create favorite
      // 4. return the newly created favorite id

      const photoId = request.params.id;
      const userId = request.user.id;

      /**
       * Check if favorite already exists
       */
      let FavoriteExists = false;
      Favorite.findOne({
        where: {
          user_id: userId,
          photo_id: photoId,
        },
      }).then((favorite) => {
        FavoriteExists = !!favorite;

        if (FavoriteExists) {
          console.log("favorite already exists");
          response.status(400).send({
            error: "Favorite already exists.",
          });
          return;
        }

        Favorite.create({
          user_id: userId,
          photo_id: photoId,
        }).then((favorite) => {
          response.status(200).send({
            data: favorite,
            message: "Favorite added",
          });
        });
      });
    } catch (error) {
      console.log("addFavorite error", error);
      response.status(500).send({ error });
    }
  },
  removeFavorite: function (request, response) {
    try {
      const photoId = request.params.id;
      const userId = request.user.id;

      Favorite.destroy({
        where: {
          user_id: userId,
          photo_id: photoId,
        },
      })
        .then((favoriteId) => {
          response.status(204).send({
			  data: favoriteId,
			  message: 'Favorite removed'
		  });
        })
        .catch((error) => {
          response.status(400).send({
            error: "Favorite not found",
          });
        });
    } catch (error) {
      console.log("removeFavorite error", error);
      response.status(500).send({ error });
    }
  },
};

// remove favorite todo steps
/*
    1. check if user passed favorite id in the request params
    2. delete favorite by id
*/
