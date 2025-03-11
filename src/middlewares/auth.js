const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next) => {
   try{
      const {token} = req.cookies;
      if(!token){
        return res.status(401).json({message:"No token ,please Login"});
      }
      const decodedObj = jwt.verify(token,process.env.JWT_TOKEN);

      const {_id} = decodedObj;
      const user = await User.findById(_id);
      if(!user){
        throw new Error("User is not Found");
      }
      req.user = user;
      next();
   }catch(err){
    res.status(400).send("ERROR: "+error.message);
   }
}

const adminAuth = async(req,res,next) => {
    const {token} = req.cookies;
    if(!token){
        res.status(401).json({message:"No token ,please Login"});
        return;
    }
    const decodedObj = jwt.verify(token,process.env.JWT_TOKEN);
    const {_id} =  decodedObj;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not found");
    }
    if(!user.isAdmin){
        return res.status(403).json({message: "Access denied.Admins only. "});
    }
    req.user = user;
    next();
}

module.exports = { userAuth, adminAuth };