const { BadRequestError } = require("../core/error.response");
const UserRepository = require("../models/repositories/user.repository");
const RoleRepository = require("../models/repositories/role.repository")
const { convertToObjectIdMongo, equalsToEvery } = require("../utils");

const getRoleByAccess = async (req,res,next) => {
    const {userId} = req.user;
    if(!userId) throw new BadRequestError({message:'Forbiden Error - USER ID'})
     const foundUser = await UserRepository.getUserById(convertToObjectIdMongo(userId));
    if(!foundUser) throw new BadRequestError({message:'Forbiden Error -FOUND USER'})
     console.log("Found User:: ",foundUser)
    const {roles} = foundUser;
    return roles;
}

const getPermissionByRoles = async roles => {
   const result = await Promise.all(roles.map( async val => {
        const foundRole = await RoleRepository.checkExistRole({filter:{name:val}});
        if(foundRole) return foundRole.permissions
    }))
    console.log( result.flatMap(val => val));
    return result.flatMap(val => val);
}
const authenRole = async (...role) => {
    const roles = await getRoleByAccess(req,res,next);
    if(!roles) throw new BadRequestError({message:'Forbiden Error - Roles'});
    if(!equalsToEvery(roles,role))   throw new BadRequestError({message:"You haven't permission"})
    next();
}
const authPermission = (...permission) => {
    console.log(permission)
    return async (req,res,next) => {
        /*
            1. Check userId
            2. Get Permission 
            3.  Check Permission
        */
       const roles = await getRoleByAccess(req,res,next);
       if(!roles) throw new BadRequestError({message:'Forbiden Error - PERMISSION'});
        if(!equalsToEvery(await getPermissionByRoles(roles),permission))   throw new BadRequestError({message:"You haven't permission"})
        next();
    }
}

const authPermissionAndRole = (role = [],permission = []) => {
    return async(req,res,next) => {
        const roles = await getRoleByAccess(req,res,next);
        const permissions = await getPermissionByRoles(roles);
        if(!roles||!permissions) throw new BadRequestError({message:"You haven't permission"})
        if(!equalsToEvery(roles,role)||!equalsToEvery(permissions,permission)) throw new BadRequestError({message:"You haven't permission"});
        next();
    }
}

const authPermissionOrRole = (role = [],permission = []) => {
    return async(req,res,next) => {
        const roles = await getRoleByAccess(req,res,next);
        const permissions = await getPermissionByRoles(roles);
        if(!roles&&!permissions) throw new BadRequestError({message:"You haven't permission"})
        if(!equalsToEvery(roles,role)&&!equalsToEvery(permissions,permission)) throw new BadRequestError({message:"You haven't permission"});
        next();
    }
}

module.exports = {
    authPermission,
    authenRole,
    authPermissionAndRole,
    authPermissionOrRole
}