module.exports = function(sequelize, DataTypes){
    const Rating = sequelize.define('rating', {
        userId: DataTypes.INTEGER,
        photoId: DataTypes.INTEGER,
        rating: DataTypes.INTEGER,
    });
    
    return Rating
};