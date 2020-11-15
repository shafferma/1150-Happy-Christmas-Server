module.exports = function(sequelize, DataTypes){
    return sequelize.define('rating', {
        user_id: DataTypes.INTEGER,
        photo_id: DataTypes.INTEGER,
        rating: DataTypes.INTEGER,
    });
};