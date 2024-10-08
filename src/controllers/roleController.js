const RoleService = require("../services/role.service");
const {CREATED,} = require('../core/success.response');
const { validationResult } = require("express-validator");
const { BadRequestError } = require("../core/error.response");
const { parseErrorValidator } = require("../utils");
class roleController {
    static createRole = async (req,res,next) => {
            const error = validationResult(req);
            if(!error.isEmpty()) throw new BadRequestError({message:'Data is not valid',payload:parseErrorValidator(error.array())})
            new CREATED({metaData:await RoleService.createRole(req.body)})
            .send(res);
    } 
}
module.exports = roleController;