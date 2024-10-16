const { BadRequestError } = require("../core/error.response");
const UserRepository = require("../models/repositories/user.repository");
const RoleRepository = require("../models/repositories/role.repository")
const { convertToObjectIdMongo, equalsToEvery, equalsToSome, toArrayForObject } = require("../utils");
const ShopService = require("../services/shop.service");
const enumsDocument = require("../constant/enums.const");
const Client = require("../services/redis.service");

const getRoleByAccess = async (req,res,next) => {
    const {userId} = req.user;
    if(!userId) throw new BadRequestError({message:'Forbiden Error - USER ID'})
    const key = `role-${userId}`
    console.log("Key:: ",key)
    const rsRedis = await Client.getPromise(key);
    if(rsRedis&&rsRedis.result) return toArrayForObject(rsRedis.result);
    const foundUser = await UserRepository.getUserById(convertToObjectIdMongo(userId));
    if(!foundUser) throw new BadRequestError({message:'Forbiden Error -FOUND USER'})
     console.log("Found User:: ",foundUser)
    const {roles} = foundUser;
    await Client.setPromise({key,value:roles,time:3600});
    return roles;
}
const getPermissionByRoles = async (roles,userId) => {
    // const rolesConvert = Array.isArray(roles) ?  roles :  Array.from(JSON.parse(roles));
    const rolesConvert = toArrayForObject(roles);
    const key = `per-${userId}`
    console.log("Key per:: ",key)
    const rsRedis = await Client.getPromise(key);
    if(rsRedis&&rsRedis.result) return toArrayForObject(rsRedis.result);
    const result = await Promise.all(rolesConvert.map( async val => {
        const foundRole = await RoleRepository.checkExistRole({filter:{name:val}});
        if(foundRole) return foundRole.permissions
    }))
    const permission =  result.flatMap(val => val);
    await Client.setPromise({key,value:permission,time:3600})
    return permission;
}
const sendInfoShop = async (req) => {
    const {email,userId} = req.user;
    const key = `shop-${userId}`;
    var value;
    const shopRedis = await Client.getPromise(key)
    if(shopRedis&&shopRedis.result){ 
        value = toArrayForObject(shopRedis.result);
    }else{
        const shop = await ShopService.existEmail({email});
        if(shop){
            value = {shopId:shop._id};
            await Client.setPromise({key,value,time:3600})
        }   
    }
    if(value) req.shop = value;
    return;
}
const authSomeAccess = ({roleRq = [],permissionRq = []}) => {
    return async (req,res,next) => {
       if(roleRq.length===0 && permissionRq.length===0) throw new BadRequestError({message:'Forbiden - Error'})
       const roles = await getRoleByAccess(req,res,next);
       console.log("Roles:: ",roles)
       if(!roles) throw new BadRequestError({message:'Forbiden Error - PERMISSION'});
       if(!equalsToSome(roles,roleRq)) throw new BadRequestError({message:"You haven't permission"});
       if(permissionRq.length>0){
        const {userId} = req.user;
        const permissionAccess = await getPermissionByRoles(roles,userId);
         if(!equalsToSome(permissionAccess,permissionRq))
            throw new BadRequestError("You haven't permission")
       }
        if(roles.includes(enumsDocument.ROLE[1])){
            console.log("abc")
            await sendInfoShop(req)
        }
        next();
    }
}
module.exports = {
    authSomeAccess
}