module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define("user", {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        email: DataTypes.STRING,
        admin: DataTypes.BOOLEAN,
    });

    return User
};