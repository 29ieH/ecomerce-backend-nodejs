const { BadRequestError } = require("../core/error.response")
const PermissionRepository = require("../models/repositories/permission.repository")

class PermissionService {
    static createPermission = async ({
        name,description
    }) => {
        const filter = {
            name
        }
        const foundPermission = await PermissionRepository.checkExistPermission({filter})
        if(foundPermission) throw new BadRequestError('Permission is exist')
        return await PermissionRepository.createPermission({
            name,
            description
        })
    }
}
module.exports = PermissionService