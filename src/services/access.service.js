'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt")
const crypt = require("crypto");
const { createToken } = require("../auth/authUtils");
const KeyTokenService = require("./keyToken.service");
const {getInfoData} = require("../utils/index")
const {ConflicRequestError,BadRequestError,AuthenFailError} = require('../core/error.response');
const { existEmail } = require("./shop.service");
const { JWTverify } = require("../helpers/jwt.core");
const RoleShop = {
    SHOP:'SHOP',
    WRITER:'WRITER',
    READER:'READER',
    EDITOR:'EDITOR',
    ADMIN:'ADMIN'
}
class AccessService{
    static handlerRefreshtoken = async ({refreshToken}) => {
        /*
        1. Check refreshTiken has used?  
            1.1 Y:: Delete Token -> Require re-login 
            1.2 N:: next
        2. Create new accessToken,refreshToken, update refreshToken in database.  
        */
       const tokenUsed = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
       if(tokenUsed){
        console.log("Token Used:: ",tokenUsed);
        const {userId,email }= await JWTverify(refreshToken,tokenUsed.privateKey);
        console.log({userId,email})
        await KeyTokenService.removeByUserID({userId})
        throw new AuthenFailError('Something wrong happen, pls!!!')
       }
       const holderContext = await KeyTokenService.findByRefreshToken(refreshToken);
       console.log("Holder Context:: ",holderContext)
       if(!holderContext) throw new AuthenFailError('Forbiden Error')
        const {userId,email} = await JWTverify(refreshToken,holderContext.privateKey);
        const shopFound = await existEmail({email});
        if(!shopFound) throw new AuthenFailError('Shop not registed')
        const tokens = await createToken({userId,email},holderContext.privateKey,holderContext.publicKey);
        await holderContext.updateOne({
            $set:{
                refreshToken:tokens.refreshToken
            },
            $addToSet:{
                refreshTokenUsed:refreshToken
            }
        })
        const user = {userId,email};
        const keys = {
            accessToken:tokens.accessToken,
            refreshToken:holderContext.refreshToken
        }
        return {
            code:200,
            data:{
                user,
                keys
            }
        }
    }
    static logout = async(keyStore) => {
        const keyDelete = await KeyTokenService.removeByID({keyId:keyStore._id});
        return {
            code:200,
            data:{
                key:keyDelete
            }
        }
    }
    // Check exist Email  
    // Check match Password
    // Create token
    // Return data
    static login = async ({email,password,refreshToken = null}) => {
        const shopFound = await existEmail({email});
        if(!shopFound) throw new ConflicRequestError('Shop is not registed')
        const match = bcrypt.compareSync(password,shopFound.password);
        if(!match) throw new AuthenFailError('Password is not correct')
        const privateKey = crypt.randomBytes(64).toString('hex')
        const publicKey = crypt.randomBytes(64).toString('hex')
        const tokens = await createToken({
            userId:shopFound._id,
            email:shopFound.email
        },privateKey,publicKey)
        await KeyTokenService.createPublicKey({
            userId:shopFound._id,
            privateKey,publicKey,
            refreshToken:tokens.refreshToken
        })
        return {
            code:201,
            data:{
                shop:getInfoData({fields:['_id','name','email'],obj:shopFound}),
                tokens
            }
        }
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
                const tokens = await createToken({
                    userId:newShop._id,
                    email:newShop.email
                },privateKey,publicKey)
                const {privateKeyStore,publicKeyStore} = await KeyTokenService.createPublicKey(              
                    {userId:newShop._id,publicKey,privateKey,refreshToken:tokens.refreshToken}
                );
                console.log(`Private: ${privateKeyStore}, Public: ${publicKeyStore}`)
                if(!privateKeyStore||!publicKeyStore){
                    return {
                        code: 'xxx',
                        message:'create key store error !'
                    }
                }
                // Create token for user 
                return {
                    code:201,
                    data:{
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