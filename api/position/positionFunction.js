const { ROUTE, EXIST_AREA } = require('../models')

const positionFunctions = {}

positionFunctions.locationToDB = async function(position) {
    console.log('function 진입')
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

module.exports = positionFunctions