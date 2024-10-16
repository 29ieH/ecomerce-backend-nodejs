// const { updateNestedObjectParser, removeUndefiedObject, equalsArrayAll,toArraySlugify, equalsToEvery } = require(".")
// const slugify = require('slugify')
// const enumsDocument = require("../constant/enums.const")
// // const arr1 = ['abdcc']
// // const arr2Cp = ['abd', 'dkf-c', 'abc-c']
// // const arr2 = ['abc-c', 'adb']
// // const arr1n = [1, 2, 3];
// // const arr2n = [3, 2, 1];
// // const arr = [ 'READ-ALL' ]
// // console.log(equalsArrayAll(enumsDocument.PERMISSION, arr))
// // const chars = 'a b c'
// // const result = slugify(chars)
// // console.log(result)
// // console.log(toArraySlugify(arr))
// const arrObj = ['a','b','c']
// const arrz = 'c';
// console.log(equalsToEvery(arrObj,...['a','z']))
const client = require('../services/redis.service')
(async () => {
    try {
        const set = await client.setPromise({ key: 'nieh', value: 29 });
        console.log('Set result:', set);

        const get = await client.getPromise('nieh');
        console.log('Get result:', get);
    } catch (error) {
        console.error('Error during Redis operations:', error);
    }
})();

