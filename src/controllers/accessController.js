const AccessService = require("../services/access.Service");
const {CREATED,OK} = require('../core/success.response')
class accessController {
    signUp = async (req,res,next) => {
        // try {
            // console.log("SignUp:: ",req.body)
            // return res.status(201).json(await AccessService.signUp(req.body))
            new CREATED({metaData:await AccessService.signUp(req.body)})
            .send(res);
        // } catch (error) {
        //     next(error)
        // }
    } 
    login = async (req,res,next) => {
        new OK({metaData:await AccessService.login(req.body)})
            .send(res);
    }
    logout = async (req,res,next) => {
        new OK({metaData:await AccessService.logout(req.keyStore)})
            .send(res);
    }
    handleToken = async (req,res,next) => {
        new OK({
            metaData: await AccessService.handlerRefreshtoken(req.body)
        }).send(res)
    }
}
module.exports = new accessController();