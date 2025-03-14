const express = require("express");
const profileRouter = express.Router();
const {userAuth, adminAuth} = require("../middlewares/auth")


//profile
profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
         const user = req.user;
         res.send(user); 
     }catch(err){
         res.status(400).send("ERROR : "+err.message);
     }
 })


 //profile
profileRouter.get("/admin/profile/view",adminAuth,async(req,res)=>{
    try{
         const user = req.user;
         res.send(user); 
     }catch(err){
         res.status(400).send("ERROR : "+err.message);
     }
 })


module.exports = profileRouter;