const DB = require("../db");
const Rating = DB.import("../models/rating");

module.exports = {
  addRating: function (request, response) {
    try {
      const photoId = request.params.id;
      const rated = parseInt(request.params.rating);
      const userId = request.user.id;

      // Check if favorite already exists
      let ratingExists = false;
      Rating.findOne({
        where: {
          userId: userId,
          photoId: photoId,
        },
      }).then((rating) => {
        ratingExists = !!rating;

        // use rating model to update existing rating
        if (ratingExists) {
          Rating.update({
            rating: rated,
          }, {
              where: { id: rating.id }
          }).then((updatedRating) => {
            response.status(200).send({
              data: { ...rating.dataValues, rating: rated }, // returns updated rating record
              message: "Rating updated",
            });
          });
          return;
        }

        // else, create new Rating if it did not already exist
        Rating.create({
          userId: userId,
          photoId: photoId,
          rating: rated,
        }).then((rating) => {
          response.status(200).send({
            data: rating,
            message: "Rating added",
          });
        });

      });
    } catch (error) {
      console.log("addRating error", error);
      response.status(500).send({ error });
    }
  },
  removeRating: function (request, response) {
    try {
      const photoId = request.params.id;
      const userId = request.user.id;

      Rating.destroy({
        where: {
          userId: userId,
          photoId: photoId,
        },
      })
        .then((ratingDeleted) => {
            if (!ratingDeleted) {
                response.status(404).send({
                    error: "Rating not found",
                });
                return
            }
            response.status(200).send({
                data: null,
                message: "Rating removed",
            });
        })
        .catch((error) => {
          response.status(400).send({
            error: "An error occurred attempting to delete the Rating",
          });
        });
    } catch (error) {
      console.log("removeRating error", error);
      response.status(500).send({ error });
    }
  },
};
