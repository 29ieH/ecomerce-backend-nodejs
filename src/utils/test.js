const { updateNestedObjectParser, removeUndefiedObject, equalsArrayAll,toArraySlugify, equalsToEvery } = require(".")
const slugify = require('slugify')
const enumsDocument = require("../constant/enums.const")
// const arr1 = ['abdcc']
// const arr2Cp = ['abd', 'dkf-c', 'abc-c']
// const arr2 = ['abc-c', 'adb']
// const arr1n = [1, 2, 3];
// const arr2n = [3, 2, 1];
// const arr = [ 'READ-ALL' ]
// console.log(equalsArrayAll(enumsDocument.PERMISSION, arr))
// const chars = 'a b c'
// const result = slugify(chars)
// console.log(result)
// console.log(toArraySlugify(arr))
const arrObj = ['a','b','c']
const arrz = 'c';
console.log(equalsToEvery(arrObj,...['a','z']))

