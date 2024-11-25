const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const mesage = new Schema({
  _id: { type: ObjectId },
  mesage: { type: String },
  form: { type: String, ref: "account" },
  dateMesage: { type: String },
  to: { type: String, ref: "account" },
});
module.exports = mongoose.models.mesage || mongoose.model("mesage", mesage);
