const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const comment = new Schema({
  _id: { type: ObjectId },
  comment: { type: String },
  repComment: { type: String },
  dateComment: { type: String,
    default:currentDate()
   },
  idAccount: { type: String, ref: "account" },
  idPost: { type: String, ref: "post" },
  idReel: { type: String, ref: "reel" },
});
function currentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}
module.exports = mongoose.models.comment || mongoose.model("comment", comment);
