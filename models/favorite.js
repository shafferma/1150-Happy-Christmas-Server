module.exports = function(sequelize, DataTypes) {
    const Favorite = sequelize.define('favorite', {
        userId: DataTypes.INTEGER,
        photoId: DataTypes.INTEGER,
    });

    return Favorite
};