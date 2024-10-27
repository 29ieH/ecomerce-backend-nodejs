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
const UserRepository = require("../models/repositories/user.repository");
const RoleShop = {
    SHOP:'SHOP',
    WRITER:'WRITER',
    READER:'READER',
    EDITOR:'EDITOR',
    ADMIN:'ADMIN'
}
class AccessService{
    static handlerRefreshtoken = async ({user,keyStore,refreshToken}) => {
        /*
        1. Check refreshTiken has used?  
            1.1 Y:: Delete Token -> Require re-login 
            1.2 N:: next
        2. Create new accessToken,refreshToken, update refreshToken in database.  
        */
       const {userId,email} = user;
       if(keyStore.refreshTokenUsed.includes(refreshToken)){
        await KeyTokenService.removeByUserID({userId})
        throw new AuthenFailError('Something wrong happen, pls!!!')
       }
        const tokens = await createToken({userId,email},keyStore.privateKey,keyStore.publicKey);
        await keyStore.updateOne({
            $set:{
                refreshToken:tokens.refreshToken
            },
            $addToSet:{
                refreshTokenUsed:refreshToken
            } 
        })
        const keys = {
            accessToken:tokens.accessToken,
            refreshToken:keyStore.refreshToken
        }
        return {
            code:200,
            data:{
                user,
                keys
            }
        }
    }
    static logout = async(userId) => {
        const foundToken = await KeyTokenService.findByUserId({user:userId})
        if(!foundToken) throw new BadRequestError('Forbiden Error')
        const keyDeleted = await KeyTokenService.removeByUserID({ userId:foundToken.user});
        return {
            code:200,
            data:{
                key:keyDeleted
            }
        }
    }
    // Check exist Email  
    // Check match Password
    // Create token
    // Return data
    static login = async ({email,password,refreshToken = null}) => {
        const userFound = await UserRepository.checkExistEmail(email);
        if(!userFound) throw new ConflicRequestError('User is not registed')
        const match = bcrypt.compareSync(password,userFound.password);
        if(!match) throw new AuthenFailError('Password is not correct')
        const privateKey = crypt.randomBytes(64).toString('hex')
        const publicKey = crypt.randomBytes(64).toString('hex')
        const tokens = await createToken({
            userId:userFound._id,
            email:userFound.email
        },privateKey,publicKey)
        await KeyTokenService.createPublicKey({
            userId:userFound._id,
            privateKey,publicKey,
            refreshToken:tokens.refreshToken
        })
        return {
            code:201,
            data:{
                user:getInfoData({fields:['_id','name','email'],obj:userFound}),
                tokens
            }
        }
    }
    static signUp = async ({name,email,password,address,roles}) => {
        console.log("Call Sigup")
        // try {
                   // Check exits email 
        const exitsEmail = await UserRepository.checkExistEmail(email);
            if(exitsEmail){
                // return {
                //     code:'xxx',
                //     message:'Shop already registered!'
                // }
                throw new BadRequestError({message:'Email is already registed!'})
            }
            const passwordHash = await bcrypt.hash(password,10);
            const newUser = await UserRepository.createUser({
                name,
                email,
                password:passwordHash,
                address,
                roles
            })
            if(newUser){
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
                    userId:newUser._id,
                    email:newUser.email
                },privateKey,publicKey)
                const {privateKeyStore,publicKeyStore} = await KeyTokenService.createPublicKey(              
                    {userId:newUser._id,publicKey,privateKey,refreshToken:tokens.refreshToken}
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
                        user:getInfoData({fields:['_id','name','email'],obj:newUser}),
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