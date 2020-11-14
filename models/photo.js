module.exports = function(sequelize, DataTypes){
    return sequelize.define('photo', {
        id: DataTypes.INTEGER,
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        file_name: DataTypes.STRING,
    });
};