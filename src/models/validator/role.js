const { check } = require("express-validator")
const enumsDocument = require("../../constant/enums.const")

const validateCreate = () => {
    return [
        check('name').isString().isIn(enumsDocument.ROLE).withMessage('Name is not valid'),
        check('description').optional().isAlpha().withMessage('Description is requried string'),
        check('permissions').isIn(enumsDocument.PERMISSION).withMessage('Permission is not valid')
    ]
}
const roleValidator = {
    validateCreate
}
module.exports = roleValidator