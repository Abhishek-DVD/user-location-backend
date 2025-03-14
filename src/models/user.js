const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName : {type:String,required:true,minLength:4,maxLength:50},
    lastName : {type:String},
    emailId : {type:String,required:true,unique:true,
       lowercase:true,
       trim:true,
       validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Invalid Email Address : "+value);
        }
       }
    },
    password : {type:String,required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password : "+value);
            }
        }
    },
    isAdmin : {type:Boolean,default:false},
    isOnline: {type:Boolean,default:false},
},{
    timestamps:true
});

userSchema.methods.getJWT = function(){
    const user = this;
    const token = jwt.sign({_id:user._id},process.env.JWT_TOKEN,{
        expiresIn:"7d",
    });
    return token;
}

userSchema.methods.checkPassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    //dont interchange them first comes input passwords by user, then password you are comparing against
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}

const User = mongoose.model("User",userSchema);
module.exports = User;