const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Location = require("../models/location");
const locationRouter = express.Router();

locationRouter.post("/location/update",userAuth,async (req,res)=>{
  try{
    const { latitude, longitude, accuracy, speed, deviceInfo, address } = req.body;

    if(!latitude || !longitude){
        return res.status(400).json({message:"Latitude and Longitude are required."});
    }

    const userId = req.user._id;
 
    const location = new Location({
        userId:userId,
        latitude,
        longitude,
        accuracy,
        speed,
        deviceInfo,
        address,
    })

    await location.save();
    res.status(201).json({message:"Location Updated Successfully",data:location});
  }catch(err){
    res.status(500).json({ message: "Error updating location", error: err.message });
  }
})

module.exports = locationRouter