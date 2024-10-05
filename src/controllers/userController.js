const UserService = require("../services/user.service");
const {CREATED,OK} = require('../core/success.response')
class userController {
    static signUp = async (req,res,next) => {
        // try {
            // console.log("SignUp:: ",req.body)
            // return res.status(201).json(await UserService.signUp(req.body))
            new CREATED({metaData:await UserService.signUp(req.body)})
            .send(res);
        // } catch (error) {
        //     next(error)
        // }
    } 
}
module.exports = userController;