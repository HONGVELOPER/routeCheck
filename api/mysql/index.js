const mysql = require('mysql')
const db_info = {
    host : 'localhost',
    port: '3306',
    user: 'root',
    password: '0725',
    database: 'routecheck_db'
}

module.exports = {
    init: function() {
        return mysql.createConnection(db_info)
    },
    connect: function(connect) {
        connect.connect(function(err) {
            if(err) console.log('mysql connection error ' , err)
            else console.log('mysql is connected successfully!')
        })
    }
}