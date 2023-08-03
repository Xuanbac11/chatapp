const { log } = require("console");
const myMD = require("../model/spModel");
const fs = require("fs");
const path = require("path");

var objReturn = {
  status: 200,
  msg: "OK",
};

exports.getListSp = async (req, res, next) => {
  let listSp = [];
  let listCat = [];
  let mySet = new Set();
  let mySetToArr = []
  try {
    listSp = await myMD.spModel
      .find()
      .sort({ _id: -1 })
      .populate("idCat");
      objReturn.data = listSp;
    listCat = await myMD.catModel.find();
    listSp.map((i) => {
      listCat.map((j) => {
        if (i.idCat.name == j.name) {
          mySet.add(j.name);
        }
      });
    });
    mySet.forEach((i) => {
      mySetToArr.push(i);
    });
    const filteredArray = listCat.filter((i) => !mySetToArr.includes(i.name));
    filteredArray.forEach(async (i) =>{
      await myMD.catModel.deleteOne({ _id: i._id }); 
    });
  } catch (error) {
    objReturn.status = 0;
    objReturn.msg = error.message;
  }
  setTimeout(() => {
    res.json(objReturn);
  }, 500);
};

exports.getDetailSp = async (req, res, next) => {
  let sp = {};
  try {
    sp = await myMD.spModel.findById(req.params.id);
    objReturn.data = sp;
  } catch (error) {
    objReturn.status = 0;
    objReturn.msg = error.message;
  }
  res.json(objReturn);
};

exports.getListCat = async (req, res, next) => {
  objReturn.data = undefined
  let listCat = [];
  try {
    listCat = await myMD.catModel.find();
    objReturn.data = listCat;
  } catch (error) {
    objReturn.status = 0;
    objReturn.msg = error.message;
  }
  res.json(objReturn);
};

exports.addCat = async (req, res, next) => {
  const { name } = req.body;
  objReturn.data = undefined;
  let obj = new myMD.catModel();
  obj.name = name
  let objC = await myMD.catModel.findOne({ name: name });
  if (objC == null) {
    objReturn.status = 200;
    objReturn.msg = "OK";
    try {
      await obj.save();
    } catch (error) {
    }
  } else {
    objReturn.status = 0;
    objReturn.msg = "Đã tồn tại";
  }
  res.json(objReturn)
}

exports.addSp = async (req, res, next) => {
  const uerId = "123";
  const { name, img, content, price, idCat } = req.body;
  let obj = new myMD.spModel();
  obj.name = name;
  obj.img = img;
  obj.content = content;
  obj.price = price;
  obj.idCat = idCat;
  const uploadDir = path.join(__dirname, "../public/images", uerId);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const fileItem = req.file
  obj.img = "http://localhost:3000/images/" + uerId + "/" + req.file.originalname;
  const filePath = path.join(uploadDir, fileItem.originalname);

  fs.rename(fileItem.path, filePath, async (err) => {
    if (err) console.log(err);
    else {
      obj.img =
        `http://localhost:3000/images/${uerId}/` + req.file.originalname;
      try {
        objReturn.status = 200;
        objReturn.msg = "OK";
        await obj.save();
      } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
      }
    }

    setTimeout(() => {
      res.json(objReturn);
    }, 500);
  });
};

exports.editSp = async (req, res, next) => {
  const uerId = "123";
  const { _id, name, img, content, price } = req.body;
  let obj = {};
  obj.name = name;
  obj.img = img;
  obj.content = content;
  obj.price = price;
  try {
    try {
      const uploadDir = path.join(__dirname, "../public/images", uerId);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileItem = req.file;

      obj.img =
        "http://localhost:3000/images/" + uerId + "/" + req.file.originalname;
      const filePath = path.join(uploadDir, fileItem.originalname);
      fs.rename(fileItem.path, filePath, async (err) => {
        if (err) console.log(err);
        else {
          obj.img =
            `http://localhost:3000/images/${uerId}/` + req.file.originalname;
          try {
            objReturn.data = undefined;

            await myMD.spModel.findByIdAndUpdate(_id, { $set: obj });
          } catch (error) {
            objReturn.status = 0;
            objReturn.msg = error.message;
          }
        }
        setTimeout(() => {
          return res.json(objReturn);
        }, 500);
      });
    } catch (error) {
      objReturn.data = undefined;
      await myMD.spModel.findByIdAndUpdate(_id, { $set: obj });
      setTimeout(() => {
        return res.json(objReturn);
      }, 500);
    }
  } catch (error) {
    objReturn.status = 0;
    objReturn.msg = error.message;
    setTimeout(() => {
      return res.json(objReturn);
    }, 500);
  }
};

exports.deleteSp = async (req, res, next) => {
  try {
    objReturn.data = undefined;
    let sp = await myMD.spModel.findById(req.body._id);
    if (sp) {
      await myMD.spModel.deleteOne({ _id: req.body._id });
    } else {
      objReturn.status = 0;
      objReturn.msg = "Không tồn tại";
    }
  } catch (error) {
    objReturn.status = 0;
    objReturn.msg = error.message;
  }
  setTimeout(() => {
    res.json(objReturn);
  }, 500);
};
