module.exports = function(sequelize, DataTypes){
    return sequelize.define('favorite', {
        user_id: DataTypes.INTEGER,
        photo_id: DataTypes.INTEGER,
    });
};