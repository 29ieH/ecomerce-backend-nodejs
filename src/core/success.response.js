const {SuccessCode,ReasonSuccessCode} = require('../constant/successcode.const')
class SuccessResponse {
    constructor({message = ReasonSuccessCode.OK ,statusCode = SuccessCode.OK ,metaData ={}}){
        this.message = message;
        this.statusCode = statusCode;
        this.metaData = metaData;
    }
    send = (res,headers = {}) => {
        return res.status(this.statusCode).json(
            this
        )
    }
}
class CREATED extends SuccessResponse {
    constructor({message = ReasonSuccessCode.CREATED ,statusCode  = SuccessCode.CREATED ,metaData}){
        super({message,statusCode,metaData})
    }
}
class OK extends SuccessResponse {
    constructor({message = ReasonSuccessCode.OK ,statusCode  = SuccessCode.OK ,metaData}){
        super({message,statusCode,metaData})
    }
}
module.exports = {
    CREATED,OK
}