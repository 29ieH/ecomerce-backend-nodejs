const permissionModel = require("../permission.model")

class PermissionRepository{
    static checkExistPermission = async ({filter}) => {
        return await permissionModel.findOne(filter).lean()
    }
    static createPermission = async ({name,description}) => {
        return await permissionModel.create({
            name,
            description
        })
    }
}
module.exports = PermissionRepository