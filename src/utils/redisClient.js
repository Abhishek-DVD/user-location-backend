const Redis = require("ioredis");
const dotenv = require("dotenv");
dotenv.config();
// const redis = new Redis({
//     username: 'default',
//     password: 'MbiCREUeyIIMowrTbFxuHJHbiyVahAts',
//     socket: {
//         host: 'redis-18649.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
//         port: 18649
//     }
// })


const redis = new Redis(process.env.API_KEY_REDIS);

redis.on("connect",()=>{    
    console.log("Connected to Redis");
})

redis.on("error",(err)=>{
    console.error("Reddis connection error",err);
})

module.exports = redis;