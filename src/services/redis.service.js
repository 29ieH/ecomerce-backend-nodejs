const { BadRequestError } = require('../core/error.response')
const client = require('../dbs/init.redis')
class Client {
    static setPromise = async ({key,value,time=300}) => {
        try{
            const rs =  await client.set(key,JSON.stringify(value),'EX',time);
            if(!rs) return BadRequestError({message:'Error Redis'});
            if(time>0) await client.expire(key,time)
            return rs;
        }catch(error){
           throw new BadRequestError({message:`Error Redis -${error}`});
        }
    }
    static getPromise= async (key) => {
        try{
            const rs =  await client.get(key);
            return {
                result:rs
            };
        }catch(error){
           throw new BadRequestError({message:'Error Redis'});
        }
    }
}
module.exports = Client