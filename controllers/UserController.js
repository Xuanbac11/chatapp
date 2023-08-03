const myMD = require("../model/spModel");
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
dotenv.config();
const app = require('../app');

exports.userLogin = async (req, res, next) => {
  let objReturn = {
    status: 200,
    msg: "OK",
  };
  try {
    let objU = await myMD.userModel.findOne({ Username: req.body.Username });
    if (objU != null) {
      if (req.body.Password == objU.Password) {
        let user = {
          Username: objU.Username,
          Password: objU.Password,
        };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        objReturn.data = { accessToken, objU };
        
        var io = req.app.get("io");
        io.on("connection", (socket) => {
          socket.on("Send_mess", (idUser,fullname,content) => {
            userCtrl.addChat(idUser,content)
          })
        });

        res.json(objReturn);
      } else {
        objReturn.status = 0;
        objReturn.msg = "sai pass";
        res.json(objReturn);
      }
    } else {
      objReturn.status = 0;
      objReturn.msg = "ko tồn tại";
      res.json(objReturn);
    }
  } catch (error) {
    objReturn.status = 0;
    objReturn.msg = error.message;
    res.json(objReturn);
  }
};

exports.getListUser = async (req, res, next) => {
  let objReturn = {
    status: 200,
    msg: "OK",
  };
  let listUser = [];
  try {
    listUser = await myMD.userModel.find();
    objReturn.data = listUser;
  } catch (error) {
    objReturn.status = 0;
    objReturn.msg = "Get list user false";
  }
  res.json(objReturn);
};

exports.addUser = async (req, res, next) => {
  let objReturn = {
    status: 200,
    msg: "OK",
  };
  const { fullname, Username, Password, Email } = req.body;
  let obj = new myMD.userModel();
  obj.fullname = fullname;
  obj.Username = Username;
  obj.Password = Password;
  obj.Email = Email;

  let objU = await myMD.userModel.findOne({ Username: req.body.Username });
  if (objU == null) {
    objReturn.status = 200;
    objReturn.msg = "OK";
    try {
      await obj.save();
    } catch (error) {
      console.log("err ",error);
    }
  } else {
    objReturn.status = 0;
    objReturn.msg = "Đã tồn tại";
  }
  res.json(objReturn);
};

exports.getListChat = async (req, res, next) => {
  let objReturn = {
    status: 200,
    msg: "OK",
  };
  let listDataReturn = []
  try {
    let listChat = await myMD.chatModel.find().populate("idUser");
    listChat.map(i=>{
      let dataReturn = {}
      dataReturn.idUser = i.idUser._id;
      dataReturn.fullname = i.idUser.fullname;
      dataReturn.content = i.content;
      listDataReturn.push(dataReturn)
    })
    objReturn.data = listDataReturn;
  } catch (error) {
    objReturn.status = 0;
    objReturn.msg = error.message;
  }
  res.json(objReturn);
};

exports.addChat = async (idUser, content) => {
  let obj = new myMD.chatModel();
  let objU = await myMD.userModel.findById(idUser);
  obj.idUser = idUser;
  obj.content = content;
  try {
    await obj.save();
    app.sendSocket(idUser,objU.fullname,content)
  } catch (error) {

  }
};

exports.updateUser = async (req, res, next) => {
  let objReturn = {
    status: 200,
    msg: "OK",
  };
  const { _id,fullname, Email } = req.body;
  let obj = {}
  obj.fullname = fullname;
  obj.Email = Email;
  console.log('updateUser ',obj);
  try {
    await myMD.userModel.findByIdAndUpdate(_id, { $set: obj });
  } catch (error) {
    objReturn.status = 0;
    console.log("err ",error);
  }
  res.json(objReturn);
};

exports.changePass = async (req, res, next) => {
  let objReturn = {
    status: 200,
    msg: "OK",
  };
  const { _id, newPass } = req.body;
  let obj = {}
  obj.Password = newPass
  console.log('changePass ',obj);
  try {
    await myMD.userModel.findByIdAndUpdate(_id, { $set: obj });
  } catch (error) {
    objReturn.status = 0;
    console.log("err ",error);
  }
  res.json(objReturn);
};


