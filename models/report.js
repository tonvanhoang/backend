const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const report = new Schema({
  _id: { type: ObjectId },
  content: { type: String },
  dateReport: { type: String , default:currentDate()},
  idAccount: { type: String, ref: "account" },
  owner:{type:String,ref:'account'},
  idPost: { type: String, ref: "post" },
  idReel: { type: String, ref: "reel" },
  statusReport:{type:String,
    default:'Chưa xác nhận'
  },
  request:{type:String,
    default:'Không'
  }
});
function currentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}
module.exports =
  mongoose.models.report || mongoose.model("report", report);
