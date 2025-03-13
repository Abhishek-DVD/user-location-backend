const express = require("express");
// const redis = require("../utils/redisClient");
// const redisRouter = express.Router();

// redisRouter.get("/sample",(req,res)=>{

//     redis.set("testkey","hello Redis");

//     redis.get("testkey",(err,result)=>{
//         if(err){
//             console.error(err);
//             return;
//         }
//         console.log("value for test key : ",result);
//     })
//     res.send("Redis test");
// })

// module.exports = redisRouter;