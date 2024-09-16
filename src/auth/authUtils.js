const JWT = require('jsonwebtoken')
const {asyncHandler} = require('../helpers/handleUtils')
const { HEADER } = require('../constant/http.const')
const { AuthenFailError } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.service')
const createToken = async (payload,privateKey,publicKey) => {
    try {
        const accessToken = await  JWT.sign(payload,publicKey,{
            expiresIn:'1 days'
        })
        const refreshToken = await  JWT.sign(payload,privateKey,{
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
const authentication = asyncHandler(async (req,res,next) => {
    /*
        1. Check client id
        2. Get Key Store by Client id
        3. Get accesstoken
        4. Decode accesstoken with public key, match Id -> pass
        5. Send KeySotre -> Remove 
    */
        const clientId = req.headers[HEADER.CLIENT_ID];
        if(!clientId) throw new AuthenFailError('Headers is not defined')
        const keyStore = await KeyTokenService.findByUserId({user:clientId});
        if(!keyStore) throw new AuthenFailError('Forbiden Error')
        const authorization = req.headers[HEADER.AUTHORIZATION];
        if(!authorization) throw new AuthenFailError('Headers is not defined')
        try{
            const decode = JWT.verify(authorization,keyStore.publicKey);
            if(!decode) throw new AuthenFailError('Forbiden Error');
            if(!decode.userId===clientId) throw new AuthenFailError('Forbiden Error')
            req.keyStore = keyStore;
            return next();
        }
        catch(e){
            next(e);
        }
})
module.exports = {
    createToken,
    authentication
}