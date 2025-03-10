const express = require("express");
const {validateSignupData, validateLoginData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authRouter = express.Router();

//signup
authRouter.post("/signup",async (req,res)=>{
    try{
         validateSignupData(req);
         const {firstName,lastName,emailId,password} = req.body;
         
         const passwordHash = await bcrypt.hash(password,10);
         
         const user = new User({
            firstName,
            lastName,
            emailId,
            password : passwordHash,
         })

         const savedUser = await user.save();
         const token = await user.getJWT();

         res.cookie("token",token,{sameSite:"None",httpOnly:true,secure:true,expires:new Date(Date.now() + 7*24*3600000)});
         res.json({message:"User added successfully !",data:savedUser});
 
    }catch(err){
       res.status(400).send("Error saving the user : "+err.message);
    }
});

//login
authRouter.post("/login",async(req,res)=>{
    try {
        validateLoginData(req);
        const {emailId,password} = req.body;
        
        const user = await User.findOne({emailId:emailId});
    
        if(!user){
            throw new Error("Invalid Credentials");
        }
        
        const isPasswordValid = await user.checkPassword(password);
    
        if(!isPasswordValid){
            throw new Error("Password is not Correct.");
        }
    
        const token = await user.getJWT();
        res.cookie("token",token,{sameSite:"None",httpOnly:true,secure:true,expires:new Date(Date.now() + 7*24*3600000)});
        res.json({message:"User login successful.",data:user});
    } catch (err) {
        res.status(400).send("ERROR:"+err.message);
    }
})

//admin login
authRouter.post("/admin/login",async(req,res)=>{
    try {
        validateLoginData(req);
        const {emailId,password} = req.body;
    
        const user = await User.findOne({emailId:emailId});
    
        if(!user){
            throw new Error("Invalid Credentials");
        }
    
        const isPasswordValid = await user.checkPassword(password);
        if(!isPasswordValid){
            throw new Error("Password is not Correct.");
        }
    
        if(!user.isAdmin) throw new Error("You dont have admin access");
    
        const token = await user.getJWT();
    
        res.cookie("adminToken",token,{sameSite:"None",httpOnly:true,secure:true,expires: new Date(Date.now()+2*24*3600000)});
        res.json({message:"Login Successful",data:user});
    } catch (err) {
        res.status(400).send("ERROR:"+err.message);
    }
})

module.exports = authRouter;