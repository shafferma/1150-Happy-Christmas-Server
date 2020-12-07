// importing the sequelize package that manages the database
const Sequelize = require("sequelize");

//create our database connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
});

// connect everything to the database object
const db = {}

db.Sequelize = Sequelize // api helper
db.sequelize = sequelize // database helper

// models and tables
db.users = require('../models/user.js')(sequelize, Sequelize)
db.favorites = require('../models/favorite.js')(sequelize, Sequelize)
db.photos = require('../models/photo.js')(sequelize, Sequelize)
db.ratings = require('../models/rating.js')(sequelize, Sequelize)

// declare associations
// db.favorites.belongsTo(db.photos, { onDelete: 'cascade' })
db.favorites.belongsTo(db.users, { onDelete: 'cascade' })

db.ratings.belongsTo(db.photos, { onDelete: 'cascade' })
db.ratings.belongsTo(db.users, { onDelete: 'cascade' })

db.photos.hasMany(db.favorites, { onDelete: 'cascade' });
db.photos.hasMany(db.ratings, { onDelete: 'cascade' });

db.photos.belongsTo(db.users);
db.users.hasMany(db.photos, { onDelete: 'cascade' });

//export database
module.exports = db;