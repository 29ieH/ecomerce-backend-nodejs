'use strict'

const { createPublicKey } = require("crypto");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService{
    static createPublicKey = async (userId,publicKey,privateKey) => {
        const key = await keytokenModel.create({
            user:userId,
            privateKey,
            publicKey
        })
        console.log(key)
        return key ? {publicKeyStore:key.publicKey,privateKeyStore:key.privateKey }: null;
    }
}
module.exports = KeyTokenService