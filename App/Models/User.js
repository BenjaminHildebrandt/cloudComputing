module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            },
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        firstname: {
            type: DataTypes.STRING
        },
        secondname: {
            type: DataTypes.STRING
        }
    });
}