const Redis = require("ioredis");

const redis = new Redis({
    port:6379,
    host:"127.0.0.1",
})

redis.on("connect",()=>{
    console.log("Connected to Redis");
})

redis.on("error",(err)=>{
    console.error("Reddis connection error",err);
})

module.exports = redis;