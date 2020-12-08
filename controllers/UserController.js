const DB = require("../db");
const User = DB.users;
const Session = require("../utls/session");
const Password = require("../utls/password");
const Values = require("../utls/values");

module.exports = {
  register: function (request, response) {
    // we wrap our code in a try/catch incase the request doesn't contain a user object
    try {
      const { username, password, email, firstname, lastname } = request.body;

      //user did not provide their username and password
      if (!username || !password || !email || !firstname || !lastname) {
        response.status(400).send({
          error: "A username, password, firstname, lastname, and email are required to register."
        });
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
          response.status(400).send({ 
            error: "Username already exists"
          })
          return;
        }

        // if username doesn't exist create user
        User.create({
          username: strippedUsername,
          password: Password.hash(password),
          firstname,
          lastname,
          email,
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
      response.status(500).send({ error })
    }
  },

  getList: function (request, response) {
    try {
      const page = request.query.page || 1
      const limit = request.query.limit || 12

      const pageCheck = page > 0 ? page-1 : 0 
      const offset = limit * pageCheck 

      User.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      }).then(data => {
        response.status(200).send({
          data: data, 
          message: "Users found"
        })
      })
     
    } catch (error) {
      console.log("UserController.getList error", error)
      response.status(500).send({ error })
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
      response.status(500).send({ error: "Error" });
    }
  },
  updateSingle: function (request, response) {
    try {
      const { username } = request.params;

      const firstname = request.body.firstname || '';
      const lastname = request.body.lastname || '';
      const email = request.body.email || '';
      const password = request.body.password || '';
      const admin = request.body.admin || false;

      console.info('updateUser, set admin', { admin })

      const userData = {
        firstname,
        lastname,
        email,
        ...(request.user.admin ? { admin: !!admin } : {}),
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

    } catch (error) {
      console.log("update error", error);
      response.status(500).send({ error: "Error" });
    }
  },
  removeSingle: function (request, response) {
    try {

      // non-admins are not allowed to delete a user
      if (!request.user.admin) {
        response.status(401).send({
          error: "Permission denied",
        });
        return;
      }

      const { username } = request.params;
      const user = request.user;

      // a user should not be allowed to delete themself
      if (user.username === username) {
        response.status(401).send({
          error: "You cannot delete yourself",
        });
        return
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
      })
      .catch(error => {
        console.log("Error deleting user", error);
        response.status(500).send({
          error: 'Error deleting User'
        });
      });
    } catch (error) {
      console.log("remove error", error);
      response.status(500).send({ error: "Error" });
    }
  },
};
