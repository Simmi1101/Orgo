const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoute");
const messageRoutes = require("./routes/messagesRoute");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const bcrypt = require("bcrypt");

const app = express();
require("dotenv").config()

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
};

app.use(bodyParser.json())
app.use(fileUpload())
app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",userRoutes);
app.use("/api/messages",messageRoutes);

mongoose
  .connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((error) => {
    console.log(error.message);
  });

const server = app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})


const io = socket(server, {
  cors:{
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  },
});

global.onlineUsers = new Map();

io.on("connection",(socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId)=>{
    onlineUsers.set(userId, socket.id);
  })

  socket.on("send-msg",(data)=>{
    const sendUserSocket = onlineUsers.get(data.to)
    if(sendUserSocket){
        socket.to(sendUserSocket).emit("msg-recieve", data.message) 
    }
    console.log("Msg1", data.message);
     
  })
  
  socket.on("send-file",(data)=>{
    const sendUserSocket = onlineUsers.get(data.to)
    if(sendUserSocket){
        socket.to(sendUserSocket).emit("msg-recieve", data.Url) 
    }
     console.log(data.Url);
  })
})

