module.exports = function(sequelize, DataTypes){
    return sequelize.define('photo', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        userId: DataTypes.INTEGER,
        cloudinary_public_id: DataTypes.STRING,
        url: DataTypes.STRING,
    });
};