const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const reel = new Schema({
  _id: { type: ObjectId, auto: true },
  video: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String },
  dateReel: { type: String, required: true },
  idAccount: { type: String, ref: "account", required: true },
}, { timestamps: true });
module.exports = mongoose.models.reel || mongoose.model("reel", reel);
