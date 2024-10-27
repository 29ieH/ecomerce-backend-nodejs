const { HEADER } = require("../constant/http.const");
const { checkExistKey } = require("../services/apikey.service");

const validApiKey = async (req,res,next) => {
    console.log("Headers:: ",req.headers)
    const key = req.headers[HEADER.API_KEY]?.toString();
    console.log("Key:: ",key)
    if(!key){
        return res.status(403).json({
            message:'Forbiden error'
        })
    }
    const keyObj = await checkExistKey(key);
    if(!keyObj){
        return res.status(403).json({
            message:'Forbiden error'
        })
    }
    req.keyObj = keyObj;
    return next();
}
const checkPermission = (permission) => {
    return (req,res,next) => {
        if(!req.keyObj.permissions){
            return res.status(403).json({
                message:'Permission is dinided'
            })
        }
        const validPermission = req.keyObj.permissions.includes(permission);
        if(!validPermission){
            return res.status(403).json({
                message:'Permission is dinided'
            })
        }
        return next();
    }
}
module.exports = {
    validApiKey,
    checkPermission
}