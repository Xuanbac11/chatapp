const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://vanbac1108z01:NguyenVanBac123@cluster0.oxhsbbn.mongodb.net/asm?retryWrites=true&w=majority").catch((err) => {
  console.log("Loi CSDL: ", err);
});
module.exports = { mongoose };
