'use strict'
const {ErrorStatus,ReasonErrorStatus} = require('../constant/errorcode.const')

class AppError extends Error{
    constructor(message,status,payload={}){
        super(message);
        this.status = status;
        this.payload = payload;
    }
}
class ConflicRequestError extends AppError{
    constructor(message = ReasonErrorStatus.CONFLIC ,status = ErrorStatus.CONFLIC,payload={}){
        super(message,status,payload)
    }
}
class BadRequestError extends AppError{
    constructor(message = ReasonErrorStatus.FORBIDEN ,status = ErrorStatus.FORBIDEN,payload){
        super(message,status,payload)
    }
}
class AuthenFailError extends AppError{
    constructor(message = ReasonErrorStatus.NOTCORRECT ,status = ErrorStatus.NOTCORRECT,payload){
        super(message,status,payload)
    }
}
module.exports = {
    ConflicRequestError,
    BadRequestError,
    AuthenFailError
}

