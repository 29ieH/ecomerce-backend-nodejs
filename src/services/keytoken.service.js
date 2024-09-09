'use strict'

const { createPublicKey } = require("crypto");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService{
    static createPublicKey = async (userId,publicKey) => {
        const publicKeyString = publicKey.toString();
        console.log(`PublicKey:: ${publicKeyString}`)
        const key = await keytokenModel.create({
            user:userId,
            publicKey:publicKeyString
        })
        console.log(key)
        return key ? key.publicKey : null;
    }
}
module.exports = KeyTokenService