const router = require('express').Router()
const positionFuctions = require('./positionFunction')
const db_config = require('../mysql/index.js')
const connect = db_config.init()

router.get('/route', function(req, res) {
    console.log('get mysql route data')
    const getRoute = 'SELECT * FROM ROUTE'
    connect.query(getRoute, function(err, rows, fields) {
        if (err) {
            console.log('query is not executed. select fail... ' + err)
        } else {
            res.json(rows)
        }
    })
})

module.exports = router