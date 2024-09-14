const apikeyModel = require("../models/apikey.model")
const crypt = require('crypto')
const checkExistKey = async (key) => {
    // const newKey = apikeyModel.create({
    //     key:crypt.randomBytes(64).toString('hex'),
    //     permissions:['0000']
    // })
    const keyObj = await apikeyModel.findOne({key,status:true}).lean();
    return keyObj;
}
module.exports = {
    checkExistKey
}