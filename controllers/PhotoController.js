const DB = require("../db");
const Photo = DB.import("../models/photo");

module.exports = {
  get: function (request, response) {
    try {

      const photoId = request.params.id;

      Photo.create({
        photo_id: photoId,
        description: description,
        user_id: userId,
        filename: filename,
      }).then((photo) => {
        response.status(200).send({
          data: photo,
          message: "Photo created"
        });
      });
    } catch (error) {
      console.log("PhotoController.get error", error)
      response.status(500).send({ error })
    }
  },
  updatePhoto: function (request, response) {
    try {
      // const { } = request.params;

      Photo.update(userData, {
        where: {
          photo_id: photoId,
          filename: filename,
          description: description,

        },
      }).then(() => {
        response.status(200).send({
          data: { ...userData, photoId },
          message: "Photo updated",
        });
      });
      return;
    }
    catch (error) {
      console.log("photo error", error);
      response.send(500, "Error");
    }
  },

  removePhoto: function (request, response) {
    try {
      const { photoId } = request.params;
      // if (!request.user.admin) {
      //   response.status(401).send({
      //     error: "Permission denied",
      //   });
      //   return;
      // }

      Photo.destroy({
        where: {
          photo_id: photoId,
        },
      }).then((photoDeleted) => {
        if (!photoDeleted) {
          response.status(404).send({
            error: "Photo not found",
          });
          return;
        }
        response.status(200).send({
          message: "Photo removed",
        });
      });
    } catch (error) {
      console.log("remove error", error);
      response.send(500, "Error");
    }
  },
};
     // return [
      //     ...
      //     {
      //        id: 1,
      //        name: 'Xmas 2020!' ,
      //        description: 'Something cool I made...',
      //        username: user.username,
      //        isFavorited: true
      //     }
      // ]