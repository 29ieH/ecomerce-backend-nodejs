const _ = require('lodash')
const { Types } = require('mongoose')
const { default: slugify } = require('slugify')
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
const convertToObjectIdMongo = id => new Types.ObjectId(id);
module.exports = {
    getInfoData,
    onGetSelect,
    unlSelect,
    removeUndefiedObject,
    updateNestedObjectParser,
    convertToObjectIdMongo,
    equalsArrayAll,
    toArraySlugify
}