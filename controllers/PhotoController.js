const DB = require("../db");
const Photo = DB.import("../models/photo");

module.exports = {
  getList: function (request, response) {
    try {


     
    } catch (error) {
      console.log("PhotoController.get error", error)
      response.status(500).send({ error })
    }
  },
  getPhoto: function (request, response) {
    try {
      const photoId = request.params.id;

      Photo.findOne({
        where: {
          id: photoId
        },
      }).then((photo) => {

          // if username already exists, return an error
          if (!photo) {
            response.status(400).send({
              data: null,
              message: "Photo not found",
            });
            return;
          }

        response.status(200).send({
          data: photo,
          message: "Photo found",
        });
        // else, return response telling the client the user was not found
      });
     
    } catch (error) {
      console.log("PhotoController.get error", error)
      response.status(500).send({ error })
    }
  },
  addPhoto: function (request, response) {
    try {

      const { name, description, photo } = request.body
      const userId = request.user.id;
      const filename = "value"

      Photo.create({
        name: name,
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

      const photoId = request.params.id;
      const { name, description } = request.body
      
      const photoData = {
        name, 
        description
      }

      Photo.update(
        photoData, 
        {
          where: {
            id: photoId
          },
        }
      ).then(() => {
        response.status(200).send({
          data: { ...photoData, id: photoId },
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
      const photoId = request.params.id;
      const isAdmin = request.user.admin;
      const userId = request.user.id;

      Photo.destroy({
        where: {
          id: photoId,
          ...(!isAdmin ? { user_id: userId } : {})
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
