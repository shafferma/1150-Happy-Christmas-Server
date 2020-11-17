const DB = require("../db");
const Photo = DB.import("../models/photo");

module.exports = {
  get: function (request, response) {
    try {


      
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



    } catch (error) {
        console.log("PhotoController.get error", error)
        response.status(500).send({ error })    
    }
  },
  
};


// remove favorite todo steps
/*
    1. check if user passed favorite id in the request params
    2. delete favorite by id
*/
