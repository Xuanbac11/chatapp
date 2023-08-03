const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/asm").catch((err) => {
  console.log("Loi CSDL: ", err);
});
module.exports = { mongoose };
