const JWT = require('jsonwebtoken')
const JWTverify = async (token,secretKey) => {
    const decode =  await JWT.verify(token,secretKey);
    return decode;
}
module.exports = {
    JWTverify
}