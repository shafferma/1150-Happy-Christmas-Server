module.exports = function(sequelize, DataTypes){
    return sequelize.define('rating', {
        userId: DataTypes.INTEGER,
        photoId: DataTypes.INTEGER,
        rating: DataTypes.INTEGER,
    });
};