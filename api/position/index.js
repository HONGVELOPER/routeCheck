const router = require('express').Router()
const positionFunctions = require('./positionFunction')
const { EXIST_AREA, ROUTE } = require('../models')

router.get('/route', async(req, res) => {
    console.log('get mysql route data')
    try {
        const result = await ROUTE.findAll({
            raw: true,
        })
        return res.json(result)
    } catch(err) {
        console.log(err)
    }
})

router.post('/bound', async(req, res) => {
    console.log(req.body, 'body')
    let success = false
    try {
        for (const i of req.body.position) {
            const position = await positionFunctions.locationToDB(i)
            console.log(position, 'position')
            if (position) {
                success = true
                console.log('진입!')
            }
        }
    } catch(err) {
        success = false
        console.log(err)
    }
    return res.send(success)
})

module.exports = router