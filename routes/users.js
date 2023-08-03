var express = require("express");
var router = express.Router();
var userCtl = require("../controllers/UserController");
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
dotenv.config();
router.post("/login", userCtl.userLogin);
router.get("/list", userCtl.getListUser);
router.post("/singup", userCtl.addUser);
router.get("/chat", userCtl.getListChat);
router.post("/addChat", userCtl.addChat);
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
router.post("/updateUser",userCtl.updateUser)
router.post("/changePass",userCtl.changePass)
module.exports = router;
