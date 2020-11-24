const DB = require("../db");
const Photo = DB.photos;
const Cloud = require('cloudinary').v2;
const { v4: uuid } = require('uuid');

module.exports = {
  getList: function (request, response) {
    try {
     
      const user = request.user
      const userId = user ? user.id : null;
      const page = request.body.page || 1
      const limit = request.body.limit || 12
      const pageCheck = page > 0 ? page-1 : 0 
      const offset = limit * pageCheck 

      Photo.findAndCountAll({
        // raw: true,
        limit,
        offset,
        attributes: [
          'name',
          'id',
          'description',
          'url',
          'userId',
          'createdAt',
          'updatedAt'
        ],
        include: [
          { model: DB.users, attributes: ['id', 'username'], required: false},
          { model: DB.favorites, limit: 1, where: { userId }, required: false }
        ]
      }).then(data => {

        data.rows = data.rows.map(photo => {
          photo.setDataValue('hasFavorite', !!photo.favorites.length)
          delete photo.dataValues['favorites']
          return photo
        })

        response.status(200).send({
          data, 
          message: "Photos found"
        })
      })
     
    } catch (error) {
      console.log("PhotoController.getList error", error)
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

      // id of the user who made the request
      const userId = request.user.id;

      // user input about the photo
      // `photo` is a base64 string 
      const { name, description, photo } = request.body

      // generate a unique ID - https://github.com/uuidjs/uuid
      const filename = uuid() // example ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

      /**
       * Upload base64String to Cloudinary account.
       * Use result to populate `photo` table.
       */
      Cloud.uploader.upload(photo, { public_id: filename }, (error, result) => {

        if (error) {
          console.log('Error uploading photo to Cloudinary', { error })
          throw 'Error uploading photo.'
        }

        Photo.create({
          name: name,
          description: description,
          userId,
          cloudinary_public_id: result.public_id,
          url: result.secure_url
        }).then((photo) => {

          // clone newly created data
          const data = { ...photo.dataValues }

          // remove the asset id, not for public
          delete data['cloudinary_assetId']

          response.status(200).send({
            data,
            message: "Photo created"
          });
        });
      })

    } catch (error) {
      console.log("PhotoController.addPhoto error", error)
      response.status(500).send({ error })
    }
  },

  updatePhoto: function (request, response) {
    try {
      const isAdmin = request.user.admin;
      const userId = request.user.id;
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
            id: photoId,
          ...(!isAdmin ? { userId: userId } : {})
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
      console.log("updatePhoto error", error);
      response.send(500, "Error");
    }
  },

  removePhoto: function (request, response) {
    try {
      const photoId = request.params.id;
      const isAdmin = request.user.admin;
      const userId = request.user.id;

      // find photo to get the cloudinary_public_id
      Photo.findOne({
        where: {
          id: photoId,
          ...(!isAdmin ? { userId } : {})
        },
      }).then(photo => {
        
        if (!photo) {
          response.status(404).send({
            error: "Photo not found",
          });
          return;
        }

        // delete from cloudinary
        Cloud.uploader.destroy(photo.cloudinary_public_id, {}, (error, result) => {
          
          if (error) {
            throw 'Error deleting photo from Cloudinary', { error }
          }

          // delete from database if removed from cloudinary
          Photo.destroy({
            where: {
              id: photoId,
              ...(!isAdmin ? { userId: userId } : {})
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
        })
      })

    } catch (error) {
      console.log("removePhoto error", error);
      response.send(500, "Error");
    }
  },
};