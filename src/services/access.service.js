'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt")
const crypt = require("crypto");
const { createToken } = require("../auth/authUtils");
const KeyTokenService = require("./keyToken.service");
const {getInfoData} = require("../utils/index")
const {ConflicRequestError,BadRequestError,AuthenFailError} = require('../core/error.response');
const { existEmail } = require("./shop.service");
const RoleShop = {
    SHOP:'SHOP',
    WRITER:'WRITER',
    READER:'READER',
    EDITOR:'EDITOR',
    ADMIN:'ADMIN'
}
class AccessService{
    // Check exist Email  
    // Check match Password
    // Create token
    // Return data
    static login = async ({email,password,refreshToken = null}) => {
        const shopFound = await existEmail({email});
        if(!shopFound) throw new ConflicRequestError('Shop is not registed')
        const match = bcrypt.compareSync(password,shopFound.password);
        if(!match) throw new AuthenFailError('Password is not correct')
    }
    static signUp = async ({name,email,password,roles}) => {
        // try {
                   // Check exits email 
        const exitsEmail = await shopModel.findOne({email}).lean();
            if(exitsEmail){
                // return {
                //     code:'xxx',
                //     message:'Shop already registered!'
                // }
                throw new BadRequestError('Error: Shop already registered!')
            }
            const passwordHash = await bcrypt.hash(password,10);
            const roleCreated = roles ?? [RoleShop.SHOP];
            console.log(`Roles:: ${roleCreated}`)
            const newShop = await shopModel.create({
                name,email,password:passwordHash,roles:roleCreated
            })
            if(newShop){
                // create private key, public key - rsa (thuat toan bat doi xung)
                // const {privateKey,publicKey} = crypt.generateKeyPairSync('rsa',{
                //     modulusLength:4096,
                //     publicKeyEncoding:{
                //         type:'pkcs1',
                //         format:'pem'
                //     },
                //     privateKeyEncoding:{
                //         type:'pkcs1',
                //         format:'pem'
                //     }
                // })
                // Save public key of User
                const privateKey = crypt.randomBytes(64).toString('hex')
                const publicKey = crypt.randomBytes(64).toString('hex')
                const {privateKeyStore,publicKeyStore} = await KeyTokenService.createPublicKey(newShop._id,publicKey,privateKey);
                console.log(`Private: ${privateKeyStore}, Public: ${publicKeyStore}`)
                if(!privateKeyStore||!publicKeyStore){
                    return {
                        code: 'xxx',
                        message:'create key store error !'
                    }
                }
                // Create token for user 
                const tokens = await createToken({
                    userId:newShop._id,
                    email:newShop.email
                },privateKeyStore,publicKeyStore)
                return {
                    code:201,
                    metadata:{
                        shop:getInfoData({fields:['_id','name','email'],obj:newShop}),
                        tokens
                    }
                }
            }    
            return {
                code:200,
                metadata:null
            }

        // } catch (error) {
        //     return  {
        //         code:'xxx',
        //         message:error.message,
        //         status:'error'
        //     }
        // }

    }
}   
module.exports = AccessService;