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
                isEmail: true,
                notNull: true
            },
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        secondname: {
            type: DataTypes.STRING
        }
    });
}