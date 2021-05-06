const express = require('express')
const app = express()

const route = require('./position')

app.use('/position', route)

module.exports = {
    path: '/api',
    handler: app
}
