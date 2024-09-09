'use strict'

const dev = {
    app:{
        port:process.env.APP_DEV_PORT || 3055
    },
    db:{
        host:process.env.DEV_DB_HOST || 'localhost',
        port:process.env.DEV_DB_PORT || 27017,
        name:process.env.DEV_DB_NAME || 'shopDev',
    }
    
}
const pro = {
    app:{
        port:process.env.APP_PRO_PORT || 3054
    },
    db:{
        host:process.env.PRO_DB_HOST || 'localhost',
        port:process.env.PRO_DB_PORT || 27017,
        name:process.env.PRO_DB_NAME || 'shopPro',
    }
}
const config = {dev,pro}
const env = process.env.NODE_ENV || 'dev'
console.log(config[env])
module.exports = config[env]