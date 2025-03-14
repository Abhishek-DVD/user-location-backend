const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
   userId:{
    type : mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   latitude:{
     type:Number,
     required:true
   },
   longitude:{
    type:Number,
    required:true,
   },
   accuracy: {
        type: Number // Optional, stores GPS accuracy in meters
    },
    speed: {
        type: Number // Optional, stores speed in m/s
    },
    deviceInfo: {
        browser: { type: String },
        os: { type: String },
        device: { type: String },
        vendor: { type: String }
    },
    address: {
      country : {type:String},
      state : {type:String},
      city : {type:String},
      postcode : {type:String},
    }
},{
    timestamps:true,
})

const Location = mongoose.model("Location",locationSchema);
module.exports = Location;