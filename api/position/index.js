const router = require('express').Router()
const positionFunctions = require('./positionFunction')
const { EXIST_AREA, ROUTE } = require('../models')
const Sequelize = require('sequelize')

router.get('/route', async(req, res) => {
    console.log('get mysql route data')
    try {
        const response = await positionFunctions.getIntervalMap()
        return res.json(response)      
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
//   console.log(interval_array)
  return res.json(interval_array)
})

router.get('/chart', async(req, res) => {
    console.log('차트 진입')
    const hour = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    const hour_interval_count = []
    const age = ['1', '2', '3', '4', '5', '6']
    const age_count = [0, 0, 0, 0, 0, 0]
    const result = {}
    try {
        const response_interval = await positionFunctions.getTimeInfo()
        for (const i of hour) {
            let one_hour_by = 0
            for (const j of response_interval) {
                let time = parseInt(j.R_START_TIME.substring(11, 13)) + 9
                if (time >= 24) {
                    time -= 24
                }
                if (time == i) {
                    one_hour_by += 1
                }
            }
            hour_interval_count.push(one_hour_by)
        }
        result.usageTime = hour_interval_count
        const response_gender_age = await positionFunctions.getGenderAgeInfo()
        let male_count = 0
        let female_count = 0
        for (const i of response_gender_age) {
            if (i.R_GENDER === 'M') {
                male_count += 1
            } else {
                female_count += 1
            }
            for (const j of age) {
                if (i.R_AGE.substring(0, 1) === j) {
                    age_count[parseInt(i.R_AGE.substring(0, 1)) - 1] += 1
                }
            }
        }
        result.ageCount = age_count
        result.genderCount = [male_count, female_count]
        const response_distance = await positionFunctions.getMarkerInfo()
        result.startEndInfo = response_distance
        // console.log(response_distance, 'dis')
        return res.json(result)
    } catch(err) {
        console.log(err)
    }
})

router.get('/marker', async(req, res) => {
    console.log('marker 진입')
    try {
        const response = await positionFunctions.getMarkerInfo()
        return res.send(response)
    } catch(err) {
        console.log(err)
    }
})

module.exports = router