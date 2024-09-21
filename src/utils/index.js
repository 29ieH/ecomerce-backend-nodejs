const _ = require('lodash')
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
module.exports = {
    getInfoData,
    onGetSelect,
    unlSelect
}