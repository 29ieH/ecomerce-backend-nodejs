const AccessService = require("../services/access.Service");

class accessController {
    signUp = async (req,res,next) => {
        try {
            console.log("SignUp:: ",req.body)
            return res.status(201).json(await AccessService.signUp(req.body))
        } catch (error) {
            next(error)
        }
    } 
}
module.exports = new accessController();