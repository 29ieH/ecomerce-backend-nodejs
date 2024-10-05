const roleModel = require("../role.model")

class RoleRepository{
    static checkExistRole = async ({filter}) => {
        return await roleModel.findOne(filter).lean();
    }
    static createRole = async ({
        name,
        description,
        permissions
    }) => {
        return await roleModel.create({
            name,
            description,
            permissions
        })
    }
}
module.exports = RoleRepository