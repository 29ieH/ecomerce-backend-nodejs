const userModel = require("../user.model")

class UserRepository{
    static checkExistUser = async ({
        filter
    }) => {
        return await userModel.findOne(filter);
    }
    static checkExistEmail = async (email) => {
        return await userModel.findOne({
            email,
            
        })
    }
    static createUser = async(body) => {
        return await userModel.create(body)
    }
}
module.exports = UserRepository