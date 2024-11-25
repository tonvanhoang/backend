const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const account = new Schema({
  _id: { type: ObjectId },
  firstName: { type: String },
  lastName: { type: String },
  avata: { type: String, default: '../img/avata.jpg'  },
  role: { type: String, default: "user" },
  birth: { type: String },
  gender:{type:String},
  lastTimeOnline:{type:String},
  phoneNumber: { type: Number },
  date: { type: String ,
    default:currentDate()
  },
  email: { type: String},
  password: { type: String},
  resetPasswordToken:{ type: String}, 
  resetPasswordExpires:{ type: Date}, 
});
function currentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}
module.exports = mongoose.models.account || mongoose.model("account", account);
