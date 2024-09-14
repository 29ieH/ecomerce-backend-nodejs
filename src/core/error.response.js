'use strict'
const {ErrorStatus,ReasonErrorStatus} = require('../constant/errorcode.const')

class AppError extends Error{
    constructor(message,status){
        super(message);
        this.status = status;
    }
}
class ConflicRequestError extends AppError{
    constructor(message = ReasonErrorStatus.CONFLIC ,status = ErrorStatus.CONFLIC){
        super(message,status)
    }
}
class BadRequestError extends AppError{
    constructor(message = ReasonErrorStatus.FORBIDEN ,status = ErrorStatus.FORBIDEN){
        super(message,status)
    }
}
class AuthenFailError extends AppError{
    constructor(message = ReasonErrorStatus.NOTCORRECT ,status = ErrorStatus.NOTCORRECT){
        super(message,status)
    }
}
module.exports = {
    ConflicRequestError,
    BadRequestError,
    AuthenFailError
}

