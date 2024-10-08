const { check } = require("express-validator");
const enumsDocument = require("../../constant/enums.const");

const validateCreate = () => {
    retrun [
        check('name').isString()
        .withMessage('Name is required String')
        .bail()
        .isLength({min:3,max:20})
        .withMessage('Name must be than min 3 character'),
        check('email').isEmail().withMessage('Email is not valid'),
        check('password').not().isEmpty()
        .withMessage('Password is not null')
        .bail()
        .isLength({min:6})
        .withMessage('Password is mut be than 6 characters'),
        check('roles').optional().isIn(enumsDocument.ROLE).withMessage('Roles is not valid')
    ];
}
const userValidator = {
    validateCreate
}
module.exports = userValidator