const ErrorStatus = {
    FORBIDEN:403,
    CONFLIC:409,
    NOTCORRECT:405
}
const ReasonErrorStatus = {
    FORBIDEN:'Bad request',
    CONFLIC:'Conflic error',
    NOTCORRECT:'Not Correct'
}
module.exports = {
    ErrorStatus,
    ReasonErrorStatus
}