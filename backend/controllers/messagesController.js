const { log } = require("util");
const Messages = require("../models/messageModel");
const generateFileUrl = require("../s3");
const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY
})


const addMessage = async(req, res, next) => {
    try {
        
        const {from, to, message} = req.body;
        const data = await Messages.create({
            message: {text: message},
            users: [from, to],
            sender: from,
        });
        
        if(data){
            return res.json({
                msg:"Message added successfully."
            })
        }else{
            return res.json({
                success:true,
                msg:"Failed to add message."
            })
        }
    } catch (error) {
        return res.json({
            status:400,
            msg: error.msg
        })
    }
}

const getallMessage = async(req, res, next) => {
    try {
        const { from, to } = req.body;
    
        const messages = await Messages.find({
          users: {
            $all: [from, to],
          }
        }).sort({ updatedAt: 1 });
        
        const projectedMessages = messages.map((msg) => {
          return {
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text
          };
        }); 
        res.json(projectedMessages);
    }catch(error){
        return res.json({
            status:400,
            msg: error.msg
        })
    }
}

// const uploadFile = async(req, res) => {
//     console.log("result",req.file);
//     const fileName = req.file.filename;
//     console.log("fileName",fileName);
//     try{
//         const file =  await Messages.$addFields({file:fileName});

//         const newFile = new Messages(file)

//         const savefile = newFile.save()
    
//         res.send({status:"ok", data:savefile})
        
//     }catch(error){
//         res.json({status:error})
//     }
// }
    

const getMsgHistory = async(req, res, next) => {
    try {
        const allMessages = await Messages.find({})
            
        // console.log("allMessages",allMessages);
        
        return res.json({
            status:200,
            data:allMessages
        })
    } catch (error) {
        return res.json({
            status:400,
            msg: error.message
        })
    }
}

const getUploadFile = async(req, res) => {
    try {
        const uploadFiles = req.files;
        const {from, to} = req.body;
      
        const awsuploads = await uploadFileOnly(uploadFiles.files.data, uploadFiles.files.name, "");
        
        const data = new Messages({
          message: {text: awsuploads.data },
          users: [from, to],
          sender: from,
        });

        await data.save();
        
        return res.status(200).json({
            status:200,
            msg:"file uploaded",
            data: data
            }); 

    } catch (error) {
        return res.status(400).json({
            status:400,
            message: error.message
        })
    }
}

const getUploadFileUrl = async(req, res) => {
    try{
        const fileUrl = req.body.file;
        console.log("fileUrl", fileUrl)
        const getFile = await get_secure_url(fileUrl);

        return res.status(200).json({
            status:200,
            data:getFile
        })
    }catch(error){
        return res.json({
            status:400,
            msg: error.message
        })
    }
}

const uploadFileOnly = (fileContent, fileName, ContentEncoding) => {
    // Read content from the file
    //const fileContent = fs.readFileSync(fileName);
  
    // Setting up S3 upload parameters
    var params = {
      Bucket: process.env.AWS_BUCKETNAME,
      Key: fileName, // File name you want to save as in S3
      Body: fileContent,
      //ACL:'public-read'
    };
  
    if (ContentEncoding) {
      params.ContentEncoding = ContentEncoding;
    }
  
    // Uploading files to the bucket
    return new Promise((resolve, reject) => {
      s3.upload(params, function (err, data) {
        if (err) {
          resolve({
            statusCode: 500,
            error: err,
          });
          return;
        }
        resolve({
          statusCode: 200,
          data: data.Location,
        });
        console.log(`File uploaded successfully. ${data.Location}`);
      });
    });
  };


  // const get_secure_url = (fileName) => {
  //   return new Promise((resolve, reject) => {
  //     s3.getSignedUrl('getObject', {
  //       Bucket: process.env.AWS_BUCKETNAME,
  //       Key: fileName.indexOf('s3.amazonaws.com') > -1 ? encodeURI(fileName.split('.s3.amazonaws.com/')[1]) : fileName,
  //       Expires: 60 * 5, // time in seconds: e.g. 60 * 5 = 5 mins
  //     }, (err, url) => {
  //       if (err) throw err;
  //       resolve(url);
  //     });
  //   });
  // }

module.exports = {addMessage, getallMessage, getMsgHistory, getUploadFile, getUploadFileUrl}