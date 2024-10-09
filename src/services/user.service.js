const enumsDocument = require("../constant/enums.const")
const { BadRequestError } = require("../core/error.response")
const ShopRepository = require("../models/repositories/shop.repository")
const UserRepository = require("../models/repositories/user.repository")
const ShopService = require("../services/shop.service")
const { convertToObjectIdMongo } = require("../utils")
const bcrypto = require('bcrypt')

class UserService{
    static createUser = async ({name,email,password,address,roles}) => {
        const pswHash = bcrypto.hash(password,10) 
        return await UserRepository.createUser({
            name,
            email,
            password:pswHash,
            address,
            roles
        })
    }
    static upShop = async ({
        userId,shopName,shopAddress={}
    }) => {
        const filter = {
            _id:convertToObjectIdMongo(userId),
            status:'active'
        }
        const foundUser = await UserRepository.checkExistUser({filter})
        if(!foundUser) throw new BadRequestError({message:'User is not valid'});
        const foundShop = await ShopService.checkExisShop({filter:{
            user:convertToObjectIdMongo(foundUser._id),
            email:foundUser.email
        }})
        if(foundShop) throw new BadRequestError({message:'User is registed Shop'})
        const existName = await ShopService.checkExisShop({filter:{
            name:shopName
        }})
        if(existName) throw new BadRequestError({message:'Name shop is already registed'})
        const body = {
            user:foundUser._id,
            name:shopName,
            email:foundUser.email,
            address:shopAddress
        }
       const shop = await ShopRepository.createShop(body);
       if(!shop) throw new BadRequestError({message:'Error something !!!, pls resign'})
        foundUser.roles.push(enumsDocument.ROLE[1]);
       console.log("Roles:: ",foundUser.roles)
       const userUpdate = await foundUser.save();
       console.log("User:: ",userUpdate)
        if(!userUpdate) throw new BadRequestError({message:'Shop is not resign'});
        return shop;
    }
    static existEmail = async (email) => {
        const filter = {
            email,
            status:'active'
        }
        return await UserRepository.checkExistUser({
            filter
        }).lean()
    }

}
module.exports = UserService