module.exports = function(sequelize, DataTypes) {
    const route = sequelize.define('ROUTE', {
        R_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        R_LAT: {
            type: DataTypes.DECIMAL(17, 15),
            allowNull: false,
        },
        R_LNG: {
            type: DataTypes.DECIMAL(17, 14),
            allowNull: false,
        },
        R_END: {
            type:DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
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