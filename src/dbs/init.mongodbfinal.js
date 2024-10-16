const mongoose = require('mongoose')
const {db:{host,port,name}} = require('../configs/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`
console.log(`Connect String: ${connectString}`)
class Database{
    constructor(){
        this.connect();
    }
    connect(type='mongodb'){
        if(1===1){
            mongoose.set('debug',true);
            mongoose.set('debug',{color:true});
        }
        mongoose.connect("mongodb://localhost:27018,localhost:27019,localhost:27020/shopDev?replicaSet=nieh").then(_ => console.log('Connect Mongodb Pro'))
        .catch(err => console.log(`Error:: ${err}`))
    }
    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
