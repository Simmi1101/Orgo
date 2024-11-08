const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:20,
        unique:true
    },
    email:{
        type:String,
        required:true,
        max:40,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        min:8
    },
    role:{
        type:String,
        required:true,
        enum:["user", "admin"],
        lowercase:true,
        default:"user"
    },
    profilePicture:{
        type:String
    }
});

module.exports = mongoose.model("User", userSchema)
