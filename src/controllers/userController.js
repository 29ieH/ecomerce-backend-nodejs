const UserService = require("../services/user.service");
const {CREATED,OK} = require('../core/success.response')
class userController {
    static registedToShop = async (req,res,next) => {
            const {userId} = req.user;
            new CREATED({metaData:await UserService.upShop({userId,...req.body})})
            .send(res);
    } 
}
module.exports = userController;