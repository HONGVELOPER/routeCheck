const { Router } = require('express')
const { ROUTE, EXIST_AREA } = require('../models')
const Sequelize = require('sequelize')

const positionFunctions = {}

positionFunctions.getIntervalMap = async function() {
    console.log('getIntervalMap 진입')
    let data = false
    try {
        const result = await ROUTE.findAll({
            raw: true,
            // where: {
            //     R_ID: {
            //         [Sequelize.Op.lt]: 2033
            //     }
            // },
        })
        data = result
    } catch (err) {
        data = false
        console.log(err)
    }
    return data
}

positionFunctions.getTimeInfo = async function() {
    console.log('getTimeInfo 진입')
    try {
        const result = await ROUTE.findAll({
            where: {
                R_START_TIME: {
                    [Sequelize.Op.ne]: 0
                }
            },
            raw: true,
            attributes: ['R_START_TIME'],
        })
        // console.log(result.length)
        return result
    } catch(err) {
        console.log(err)
    }
}

positionFunctions.getGenderAgeInfo = async function() {
    console.log('getGenderAgeInfo 진입')
    try {
        const result = await ROUTE.findAll({
            where: {
                R_GENDER: {
                    [Sequelize.Op.ne]: '0'
                }
            },
            raw: true,
            attributes: ['R_GENDER', 'R_AGE'],
        })
        // console.log(result.length, 'gender age result length')
        return result
    } catch(err) {
        console.log(err)
    }
}

positionFunctions.getStartEndInfo = async function() {
    console.log('getStartEndInfo 진입')
    try{
        const result = await ROUTE.findAll({
            where: {
                [Sequelize.Op.or]: [
                    {
                        R_START_TIME: {
                            [Sequelize.Op.ne]: '0'
                        }
                    },
                    {
                        R_END_TIME: {
                            [Sequelize.Op.ne]: '0'
                        }
                    }
                ]
            },
            raw: true,
            attributes: ['R_LAT', 'R_LNG']
        })
        // console.log(result, 'result')
        return result
    } catch(err) {
        console.log(err)
    }
}

positionFunctions.getMarkerInfo = async function() {
    console.log('getMarkerInfo 진입')
    try{
        const result = await ROUTE.findAll({
            where: {
                [Sequelize.Op.or]: [
                    {
                        R_START_TIME: {
                            [Sequelize.Op.ne]: '0'
                        }
                    },
                    {
                        R_END_TIME: {
                            [Sequelize.Op.ne]: '0'
                        }
                    }
                ]
            },
            raw: true,
            attributes: ['R_LAT', 'R_LNG']
        })
        // console.log(result, 'result')
        return result
    } catch(err) {
        console.log(err)
    }
}

module.exports = positionFunctions