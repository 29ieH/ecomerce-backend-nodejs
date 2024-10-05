const RoleService = require("../services/role.service");
const {CREATED,} = require('../core/success.response')
class roleController {
    static createRole = async (req,res,next) => {
            new CREATED({metaData:await RoleService.createRole(req.body)})
            .send(res);
    } 
}
module.exports = roleController;