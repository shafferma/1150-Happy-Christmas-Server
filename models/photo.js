module.exports = function(sequelize, DataTypes){
    const Photo = sequelize.define('photo', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        userId: DataTypes.INTEGER,
        cloudinary_public_id: DataTypes.STRING,
        url: DataTypes.STRING,
    });

    return Photo
};