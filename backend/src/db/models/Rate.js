const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const RateSchema = new Schema(
  {
    userID: String,
    productID: String,
    rate: Number,
  },
  { versionKey: false }
);

const Rate = mongoose.model("Rate", RateSchema);
module.exports = { Rate, RateSchema };
