const {addMessage, getallMessage, getMsgHistory, getUploadFile, getUploadFileUrl, getAllFiles } = require("../controllers/messagesController");
// const multer = require("multer");


const router = require("express").Router();

//file storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "./routes/filesStorage");
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`)
//     },
//   })
  
//   const upload = multer({storage: storage})
  
router.post("/addmsg",addMessage);
router.post("/getmsg",getallMessage);
router.get("/getallmsgHistory", getMsgHistory);
// router.post("/upload-files", upload.single("file"), uploadFile);
router.post("/get-files", getUploadFile);
router.post("/open-files", getUploadFileUrl);



module.exports = router