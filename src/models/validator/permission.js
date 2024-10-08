const { body, validationResult, check } = require("express-validator");
const { asyncHandler } = require("../../helpers/handleUtils");
const { BadRequestError } = require("../../core/error.response");
const { validatorObjectRequest } = require("../../utils");
const enumsDocument = require("../../constant/enums.const");

const validatorCreate = () => {
    console.log("Call validate permission")
    return [
        check('name').isString().isLength({min:3}).withMessage('Name must be than 3 characters'),
        check('name').isIn(enumsDocument.PERMISSION).withMessage('Name not valid'),
        check('description').optional().isString().withMessage('Description is string')
    ]
}
const validate = {
    validatorCreate
}
module.exports = validate