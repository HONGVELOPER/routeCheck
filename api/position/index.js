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

router.get('/interval', async(req, res) => {
  // console.log('get mysql route data')
  console.log(req.query, 'body check')
  let pass = false
  let hour = 0
  const interval_array = []
  try {
    const response = await positionFunctions.getIntervalMap()
    for (const i in response) {
        let hour = parseInt(response[i].R_START_TIME.substring(11, 13)) + 9
        if (response[i].R_START_TIME !== '0') {
            console.log(hour, ' hour check')
            console.log(parseInt(req.query.data), 'query check')
            if (hour >= 24) {
                hour -= 24
            }
            if (hour === parseInt(req.query.data)) {
                console.log(response[i], '진입')
                pass = true
                interval_array.push(response[i])
            } else {
                pass = false
            }
        }
        else if (pass) {
            console.log(response[i], '진입2')
            interval_array.push(response[i])
        }
    }
  } catch (err) {
    console.log(err)
  }
  console.log(interval_array)
  return res.json(interval_array)
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