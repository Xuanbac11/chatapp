var express = require("express");
var router = express.Router();
var spContrl = require("../controllers/SpController");
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
dotenv.config();

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.get("/listCat", spContrl.getListCat);
router.post("/addCat", spContrl.addCat);
router.use((req, res, next) => {
    const token = req.headers.authorization
    let objReturn = {}
    if (!token){
      objReturn.status = 0
      objReturn.msg = "Missing token!!"
      console.log(objReturn);
      return res.json(objReturn)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) {
        objReturn.status = 0;
        objReturn.msg = "JsonWebTokenError !!"
        console.log(objReturn);
        res.json(objReturn)
      }
      if (data) next();
    });
  });

router.get("/listSp", spContrl.getListSp);
router.post("/editSp", upload.single('file'), spContrl.editSp);
router.post("/deleteSp", spContrl.deleteSp);
router.post('/addSp',upload.single('file'), spContrl.addSp);

module.exports = router;
