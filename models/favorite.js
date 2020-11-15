module.exports = function(sequelize, DataTypes){
    return sequelize.define('favorite', {
        id: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
        photo_id: DataTypes.INTEGER,
    });
};