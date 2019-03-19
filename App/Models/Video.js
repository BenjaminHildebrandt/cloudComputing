module.exports = (sequelize, DataTypes) => {
    return sequelize.define('video', {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        length: {
            type: DataTypes.INTEGER
        },
        size: {
            type: DataTypes.DOUBLE
        },
        format: {
            type: DataTypes.STRING
        },
        path: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        }
    });
}
