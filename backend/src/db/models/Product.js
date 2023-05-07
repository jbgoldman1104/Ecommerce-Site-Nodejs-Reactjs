const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    content: { type: String },
    owner: { type: String },
    approval: { type: Boolean, default: false },
    product: String,
  },
  { timestamps: { createdAt: "createdAt" } }
);
const CommentModel = mongoose.model("Comment", CommentSchema);

const ProductSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, "Product Name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product Description is required"],
      trim: true,
    },
    unitPrice: {
      type: Number,
      required: [true, "Unit Price is required"],
    },
    categoryID: {
      type: Number,
      required: [true, "Category ID is required"],
    },
    imagePath: { type: String, default: "" },
    rateCount: { type: Number, default: 0 },  //  Total point product got from its ratings --> 3+2+4+5...
    rateTotal: { type: Number, default: 0 },  //  How many people rated --> If 5 people rated, this value is 5
    rate: { type: Number, default: 0 },       //  rateCount/rateTotal
    stock: {
      type: Number,
      required: [true, "Stock is required"],
    },
    warranty: {
      type: Number,
      required: [true, "Warranty is required"],
    },
    previousPrice: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    registeredUser: [{ type: Schema.Types.ObjectId, ref: "User" }],
    // comments: { type: [CommentSchema] },
  },
  { versionKey: false }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = { Product, CommentModel, ProductSchema };
