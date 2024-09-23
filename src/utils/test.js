const { updateNestedObjectParser, removeUndefiedObject } = require(".")

const Object = {
"product_type":"clothing",
"product_attributes":{
    "brand":"Levis's",
    "size":null,
    "material":{
        size:""
    }
}
}
console.log(updateNestedObjectParser(removeUndefiedObject(Object)))