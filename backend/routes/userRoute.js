const {register, login, getAllUsers, logOut} = require("../controllers/userController")
const { authenticate } = require("../middlewares/auth")
const multer = require("multer");

const router = require("express").Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"./routes/filesStorage")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

router.post("/register", upload.single('profilePicture'), register);
router.post("/login",login);
router.get("/allusers/:id", getAllUsers);
router.get("/logoutRoute/:id",logOut)

module.exports = router