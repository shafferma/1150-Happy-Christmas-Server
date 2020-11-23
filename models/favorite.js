module.exports = function(sequelize, DataTypes){
    return sequelize.define('favorite', {
        userId: DataTypes.INTEGER,
        photoId: DataTypes.INTEGER,
    });
};