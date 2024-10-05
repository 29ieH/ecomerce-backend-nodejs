const PermissionService = require("../services/permission.service");
const {CREATED,} = require('../core/success.response')
class permissionController {
    static createPermission = async (req,res,next) => {
            new CREATED({metaData:await PermissionService.createPermission(req.body)})
            .send(res);
    } 
}
module.exports = permissionController;