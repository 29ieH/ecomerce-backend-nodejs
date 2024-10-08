const { BadRequestError } = require("../core/error.response")
const RoleRepository = require("../models/repositories/role.repository")

class RoleService{
    static createRole = async ({
        name,
        description,
        permissions
    }) => {
        const filter = {
            name
        }
        const foundRole = await RoleRepository.checkExistRole({
            filter
        })
        if(foundRole) throw new BadRequestError({message:'Role is exist'})
        return await RoleRepository.createRole({
            name,description,permissions
        })
    }
}
module.exports  = RoleService