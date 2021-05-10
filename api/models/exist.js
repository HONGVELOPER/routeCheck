module.exports = function(sequelize, DataTypes) {
    const exist = sequelize.define('EXIST_AREA', {
        E_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        E_LAT: {
            type: DataTypes.DECIMAL(17, 15),
            allowNull: false,
        },
        E_LNG: {
            type: DataTypes.DECIMAL(17, 14),
            allowNull: false,
        },
        E_END: {
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
        tableName: 'EXIST_AREA',
        timestamps: false,
    })
    return exist
}