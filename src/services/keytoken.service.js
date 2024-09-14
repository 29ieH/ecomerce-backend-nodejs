'use strict'

const { createPublicKey } = require("crypto");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService{
    static createPublicKey = async (userId,publicKey,privateKey,refreshToken,refreshTokenUsed=[]) => {
        // const key = await keytokenModel.create({
        //     user:userId,
        //     privateKey,
        //     publicKey,
        //     refreshToken,
        //     refreshTokenUsed
        // })
        // console.log(key)
        // return key ? {publicKeyStore:key.publicKey,privateKeyStore:key.privateKey }: null;
            const filter = {_id:userId};
            const update = {
                    privateKey,
                    publicKey,
                    refreshToken,
                    refreshTokenUsed
            }
            const options = {
                new:true,
                upsert:true
            }
            const keyStore = await keytokenModel.findOneAndUpdate(filter,update,options);
            return keyStore ? {publicKeyStore:key.publicKey,privateKeyStore:key.privateKey }: null;
    }
}
module.exports = KeyTokenService