const DB = require("../db");
const User = DB.import("../models/user");
const Session = require("../utls/session");
const Password = require("../utls/password");
const Values = require("../utls/values");

module.exports = {
  register: function (request, response) {
    // we wrap our code in a try/catch incase the request doesn't contain a user object
    try {
      const { username, password } = request.body;

      //user did not provide their username and password
      if (!username || !password) {
        response.status(400).send("Provide username and password");
        return;
      }

      const strippedUsername = Values.strip(username);

      //check if username already exists
      let userExists = false;
      User.findOne({
        where: {
          username: strippedUsername,
        },
      }).then((user) => {
        // determine if the user exists for the given username
        userExists = !!user;

        // if username already exists, return an error
        if (userExists) {
          console.log("user already exists");
          response.status(400).send("Username already exists");
          return;
        }

        // if username doesn't exist create user
        User.create({
          username: strippedUsername,
          password: Password.hash(password),
          admin: false,
        }).then((user) => {
          // generate a session token using the newly created user object
          const token = Session.generateToken(user);

          // respond to the request with the following info
          response.status(200).send({
            user: user,
            message: "Account registered",
            sessionToken: token,
          });
        });
      });
    } catch (error) {
      console.log("create user error", error);
      response.send(500, "Error");
    }
  },

  getList: function (request, response) {
    try {
      response.status(200).send({
      });
    } catch (error) {
      console.log("update error", error);
      response.send(500, "Error");
    }
  },

  getSingle: function (request, response) {
    try {
      const { username } = request.params;

      User.findOne({
        where: {
          username: Values.strip(username),
        },
      }).then((user) => {
        // determine if the user exists for the given username
        userExists = !!user;

        // if username already exists, return an error
        if (userExists) {
          const userData = {
            ...user.dataValues,
          };
          delete userData["password"];
          response.status(200).send({
            user: userData,
            message: "User found",
          });
          return;
        }

        response.status(404).send({
          data: null,
          message: "User not found",
        });
        // else, return response telling the client the user was not found
      });
    } catch (error) {
      console.log("get error", error);
      response.send(500, "Error");
    }
  },
  updateSingle: function (request, response) {
    try {
      const { username } = request.params;
      const { firstname, lastname, email, password } = request.body;
      const userData = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        ...(password ? { password: Password.hash(password) } : {}),
      };
      console.log(request.body);
      User.update(userData, {
        where: {
          username: Values.strip(username),
        },
      }).then(() => {
        response.status(200).send({
          data: { ...userData, username },
          message: "Username updated",
        });
      });
      return;

      // Values.strip(username)
      // response.status(200).send({
      //     beep: 'boop'
      // })
    } catch (error) {
      console.log("update error", error);
      response.send(500, "Error");
    }
  },
  removeSingle: function (request, response) {
    try {
      const { username } = request.params;
      if (!request.user.admin) {
        response.status(401).send({
          error: "Permission denied",
        });
        return;
      }

      User.destroy({
        where: {
          username: Values.strip(username),
        },
      }).then((userDeleted) => {
        if (!userDeleted) {
          response.status(404).send({
            error: "User not found",
          });
          return;
        }
        response.status(200).send({
          message: "User removed",
        });
      });
    } catch (error) {
      console.log("remove error", error);
      response.send(500, "Error");
    }
  },
};
