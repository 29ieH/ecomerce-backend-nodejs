const { check } = require('express-validator')
const _ = require('lodash')
const { Types } = require('mongoose')
const { default: slugify } = require('slugify')
const { AppError } = require('../core/error.response')
const getInfoData = ({fields=[],obj= {}}) => {
    return _.pick(obj,fields)
}
const onGetSelect = ({arrayPick=[]}) => {
    console.log("Select:: ",arrayPick)
    return Object.fromEntries(arrayPick.map((s) => [s,1]));
}
const unlSelect = ({arrayPick=[]}) => {
    console.log("Select:: ",arrayPick)
    return Object.fromEntries(arrayPick.map((s) => [s,0]));
}
const removeUndefiedObject = obj => {
    Object.keys(obj).forEach(key => {
        if(obj[key] === null || obj[key] === undefined){
            delete obj[key]
        }
        if(typeof obj[key] === 'object' && !Array.isArray(obj[key])){
            removeUndefiedObject(obj[key])
        }
    })
    return obj;
}
const updateNestedObjectParser = obj => {
    const final = {};
    Object.keys(obj).forEach(key => {
        if(typeof obj[key] === 'object' && !Array.isArray(obj[key])){
            const response = updateNestedObjectParser(obj[key]);
            Object.keys(response).forEach(r => {
                console.log("Key:: ",r)
                final[`${key}.${r}`] = response[r];
            })
        }else{
            final[key] = obj[key];
        }
    })
    return final;
}
const equalsArrayAll = (arrDefault,arr) => {
    const valid = arr.map((val) => {
        if(!arrDefault.includes(val)) return false;
    })
    return !valid.includes(false);
}
const toArraySlugify = arr => {
    return arr.map((val) => {
        return slugify(val.toUpperCase())
    })
}
const parseErrorValidator = arrr => {
        if(!Array.isArray(arrr)) return null;
        return arrr.map(val => {
            return {
                field:val.path,
                msg:val.msg
            }
        })
}
/*
[
    {'filed',
    ,validation,
    optional
    'message'},
     {'filed',
     validation,
    'message'},
     {'filed',
     validation,
    'message'}
]
*/
const validatorObjectRequest = async (req, arr) => {
    return await Promise.all(arr.map(val => {
        console.log("Val:: ",val)
        let validator = check(val.field); // Kiểm tra tham số đúng
        if (val.optional ? val.optional : false) {
            validator = validator.optional();
        }
        if (val.validation) {
            validator = validator[val.validation.rule](...val.validation.args).withMessage(val.message);
        }
        console.log("Pass:: ")
        return validator.run(req); // Chạy validator   
    }));
};
const equalsToEvery = (arrOfObject,arr) => {
    if(arr.length==1) return arrOfObject.includes(arr[0]);
    return arr.every(val => {
        return arrOfObject.includes(val);
    })
}
const equalsToSome = (arrOfObject,arr) => {
    console.log("arr")
    if(arr.length==1) return arrOfObject.includes(arr[0]);
    return arr.some(val => {
        return arrOfObject.includes(val);
    })
}
const toArrayForObject = obj => {
    if (Array.isArray(obj)) return obj;
    return JSON.parse(obj); 
}
const handleErros = error => {
    if(error instanceof AppError){
        console.log("Error:: ",error)
        return error
    }
}
const convertToObjectIdMongo = id => new Types.ObjectId(id);
module.exports = {
    getInfoData,
    onGetSelect,
    unlSelect,
    removeUndefiedObject,
    updateNestedObjectParser,
    convertToObjectIdMongo,
    equalsArrayAll,
    toArraySlugify,
    validatorObjectRequest,
    parseErrorValidator,
    equalsToEvery,
    equalsToSome,
    toArrayForObject,
    handleErros
}