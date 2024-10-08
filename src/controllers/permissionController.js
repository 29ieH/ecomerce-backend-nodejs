const PermissionService = require("../services/permission.service");
const {CREATED,} = require('../core/success.response');
const { validationResult } = require("express-validator");
const { BadRequestError } = require("../core/error.response");
const { parseErrorValidator } = require("../utils");
class permissionController {
    static createPermission = async (req,res,next) => {
            const error = validationResult(req)
            console.log("Error:: ",parseErrorValidator(error.array()))
            if(!error.isEmpty()) throw new BadRequestError({message:'Data is not valid',payload:parseErrorValidator(error.array())})
            new CREATED({metaData:await PermissionService.createPermission(req.body)})
            .send(res);
    } 
}
module.exports = permissionController;