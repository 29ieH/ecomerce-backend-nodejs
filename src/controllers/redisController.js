const { OK } = require("../core/success.response")
const Client = require("../services/redis.service")

class RedisController {
    static setRedis = async (req,res,next) => {
        new OK({metaData:await Client.setPromise(req.body)}).send(res)
    }
    static getRedis = async (req,res,next) => {
        const {key} = req.params;
        new OK({metaData:await Client.getPromise(key)}).send(res)
    }
}   
module.exports = RedisController