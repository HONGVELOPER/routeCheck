const express = require('express')
const app = express()
const axios = require('axios')
const bodyParser = require('body-parser')

// body-parser
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

const position = require('./position')

app.use('/position', position)

module.exports = {
    path: '/api',
    handler: app
}
