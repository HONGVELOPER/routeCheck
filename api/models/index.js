const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path');

const databaseName = 'routecheck_db'
const user = 'root'
const password = '0725'
const option = {
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
		dateStrings: true,
		typeCast: true,
    },
    operatorAliases: false,
    port: 3306,
}

const sequelize = new Sequelize(databaseName, user, password, option)
const db = {}

fs.readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach(function(file) {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        )
        db[model.name] = model
    })

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db)
    }
})

db.sql = sequelize
db.S = Sequelize

sequelize.sync()
module.exports = db