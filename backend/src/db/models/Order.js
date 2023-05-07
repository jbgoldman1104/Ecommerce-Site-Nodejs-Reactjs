const mongoose = require("mongoose");
const { ProductSchema } = require("./Product");
const { User } = require("./User");

const Schema = mongoose.Schema;
const OrderSchema = new Schema(
  {
    products: [ProductSchema], // Holds array of product
    status: Number, // Indicates status of the order
    address: String, // Address of the delivery address.
    customer: [{ type: Schema.Types.ObjectId, ref: "User" }],
    refund: {type: Number, default: 0},
    date: {type: String, default: ""}
  },
  { versionKey: false }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = { Order, OrderSchema };
