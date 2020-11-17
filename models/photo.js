module.exports = function(sequelize, DataTypes){
    return sequelize.define('photo', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        filename: DataTypes.STRING,
    });
};