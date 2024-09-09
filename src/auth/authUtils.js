const JWT = require('jsonwebtoken')
const createToken = async (payload,privateKey,publicKey) => {
    try {
        const accessToken = await  JWT.sign(payload,privateKey,{
            algorithm:'RS256',
            expiresIn:'1 days'
        })
        const refreshToken = await  JWT.sign(payload,privateKey,{
            algorithm:'RS256',
            expiresIn:'7 days'
        })
        JWT.verify(accessToken,publicKey,(err,decode) => {
            if(err) console.error('error verify:: ',err)
            else console.log(`decode verify::  `,decode)   
        })
        return {accessToken,refreshToken}
    } catch (error) {
        return error;        
    }
}
module.exports = {
    createToken
}