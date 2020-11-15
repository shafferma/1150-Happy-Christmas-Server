module.exports = function(sequelize, DataTypes){
    return sequelize.define('photo', {
        id: DataTypes.INTEGER,
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        photo_id: DataTypes.STRING,
    });
};