const DB = request("../db");
const Rating = DB.import("../models/rating");

module.exports = {
    addRating: function (request, response) {
        try {

            const ratingId = request.params.id;
            const userId = request.user.id;


            Rating.create({
                user_id: userId,

            })

        }
    }
}