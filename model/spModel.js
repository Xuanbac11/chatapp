var db = require("./db");
const spSchema = new db.mongoose.Schema(
  {
    name: { type: String, required: true },
    img: { type: String, required: true },
    content: { type: String, required: true },
    price: { type: Number, required: true },
    idCat: { type: db.mongoose.Schema.Types.ObjectId, ref: "catModel",required: true },
  },
  { collection: "sp" }
);
const catSchema = new db.mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { collection: "category" }
);
const userSchema = new db.mongoose.Schema(
  {
    fullname: { type: String, required: true },
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Role: { type: Number, required: false },
    img: { type: String, required: false },
  },
  { collection: "users" }
);

const chatSchema = new db.mongoose.Schema(
  { 
    idUser: { type: db.mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    content: { type: String, required: true },
  },
  { collection: "chat" }
);

let spModel = db.mongoose.model("spModel", spSchema);
let catModel = db.mongoose.model("catModel", catSchema);
let userModel = db.mongoose.model("userModel", userSchema);
let chatModel = db.mongoose.model("chatModel", chatSchema);
module.exports = { spModel, catModel, userModel, chatModel };
