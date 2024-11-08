const User = require("../models/userModel")
const jwt = require("jsonwebtoken"); 

const authMiddleware = async(req, res, next) => {
    const authToken = req.header("Authorization");
    console.log(authToken);
    
    if(!authToken){
        return res.status(401).json({
            success:false,
            message:"Not authorized, Login again"
        })
    }

    const [bearer, token] = authHeader.split(" ");
    if(bearer !== "Bearer" || !token){
        return res.status(401).json({
            success:false,
            message:"Not authorized, Invalid token format"
        })
    }
    
    jwt.verify(token,SECRET_KEY,(err, user)=>{
        if(err){
            return res.status(401).json({
                success:false,
                message:"Forbidden: Invalid token."
            })
        }
        req.user = user;
        next()
    })
}

module.exports = {authMiddleware}

