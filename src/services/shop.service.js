const shopModel = require("../models/shop.model")

const existEmail = async ({email,select = {
    name:1,
    email:1,
    password:2,
    status:1,
    roles:1
}}) => {
    return await shopModel.findOne({email}).select(select).lean();
}
const checkExisShop= async ({filter}) => {
    return await shopModel.findOne(filter).lean();
}
module.exports = {
    existEmail,
    checkExisShop
}