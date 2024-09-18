'use strict'

const { createPublicKey } = require("crypto");
const keytokenModel = require("../models/keytoken.model");
const {Types} = require("mongoose")

class KeyTokenService{
    static createPublicKey = async ({userId,publicKey,privateKey,refreshToken}) => {
            const filter = {user:userId};
            const update = {
                    privateKey,
                    publicKey,
                    refreshToken,
                    refreshTokenUsed:[]
            }
            const options = {
                new:true,
                upsert:true
            }
            const keyStore = await keytokenModel.findOneAndUpdate(filter,update,options);
            return keyStore ? {publicKeyStore:keyStore.publicKey,privateKeyStore:keyStore.privateKey }: null;
    }
    static findByUserId = async ({user}) => {
        console.log("User:: ",user)
        const keyStore = await keytokenModel.findOne({user: new Types.ObjectId(user)});
        return keyStore;
    }
    static removeByID = async ({keyId}) => {
        const key = await keytokenModel.deleteOne({_id:new Types.ObjectId(keyId)});
        return key;
    }
    static removeByUserID = async ({userId}) => {
        const key = await keytokenModel.deleteOne({user:new Types.ObjectId(userId)});
        return key;
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({refreshTokenUsed:refreshToken}).lean();
    }
    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({refreshToken:refreshToken});
    }
}
module.exports = KeyTokenService