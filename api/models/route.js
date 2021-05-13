module.exports = function(sequelize, DataTypes) {
    const route = sequelize.define('ROUTE', {
        R_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        R_LAT: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false,
        },
        R_LNG: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: false,
        },
        R_START_TIME: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        R_END_TIME: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        dateStrings: true,
        typeCast: true,
        freezeTableName: true,
        tableName: 'ROUTE',
        timestamps: false,
    })
    return route
}