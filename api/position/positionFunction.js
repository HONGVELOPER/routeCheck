const { ROUTE, EXIST_AREA } = require('../models')

const positionFunctions = {}

positionFunctions.locationToDB = async function(position) {
    console.log('locationToDB 진입')
    let success = false
    try {
        for (const i of position) {
            const result = await EXIST_AREA.create({
                E_LAT: i[0],
                E_LNG: i[1],
            })
            if (result.dataValues) {
                success = true
                console.log(success, 'success')
            }
        }
    } catch (err) {
        success = false
        console.log(err)
    }
    return success
}

positionFunctions.getIntervalMap = async function() {
    console.log('getIntervalMap 진입')
    let success = false
    try {
        const result = await ROUTE.findAll({
            raw: true,
        })
        success = result
    } catch (err) {
        success = false
        console.log(err)
    }
    return success
}

module.exports = positionFunctions