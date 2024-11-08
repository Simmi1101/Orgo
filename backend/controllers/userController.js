const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = user => {
    return jwt.sign(
        {id:user._id, role:user.role},
        process.env.SECRET_KEY,
        {
            expiresIn:"15d",
        }
    )
}

const register = async(req, res, next) => {
   try {
    const {username, email, role, password, profilePicture} = req.body
    
    const checkUserName = await User.findOne({username})
    if(checkUserName)
        return res.status(400).json({msg:"Username already present"})

    const checkEmail = await User.findOne({email})
    if(checkEmail)
        return res.status(400).json({msg:"Email already present"})
    
    const saltRounds = 10;
    
    const hashSalt = await bcrypt.genSalt(saltRounds)
   
    const hashPassword = await bcrypt.hash(password, hashSalt);
    const user = new User({
        email, username, role, password:hashPassword, profilePicture
    });

    await user.save();

    return res.json({
        status:200,
        message:"user created successfully",
        data: user,
    })
   }catch (error) {
    console.log(error);
    return res.json({
        status:400,
        message:error.message
    })
    
   }
}

const login = async(req, res, next) => {
    try {
        const {username, password} = req.body
        
        const user = await User.findOne({username})
        console.log("user", user);

        if(!user)
            return res.status(400).json({msg:"Username or Password is incorrect"})

        const isPasswordValid = await bcrypt.compare(password, user.password)
        // console.log("password",password);
        // console.log("user password", user.password);

        if(!isPasswordValid)
            return res.status(400).json({msg:"Username or Password is incorrect"})

        //get token
        const token = generateToken(user);

        return res.status(200).json({
            status:200,
            msg:"successfully login",
            token,
            data:user,
            
        })
    } catch (error) {
        return res.status(400).json({
            status:400,
            msg: error.msg
        })
    }
}
 
const getAllUsers = async(req, res, next) => {
    try {
        const users = await User.find({_id:{$ne: req.params.id}}).select([
            "username",
            "email", 
            "role",
            "_id"
        ])

        // console.log("users", users);
        return res.json({
            status:200,
            users
           
        })
    } catch (error) {
        return res.json({
            status:400,
            msg: error.msg
        })
    }
}

const logOut = (req, res, next) => {
    try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
    } catch (error) {
        return res.json({
            status:400,
            msg: error.msg
        })
    }
    }



module.exports = {register, login, getAllUsers, logOut}