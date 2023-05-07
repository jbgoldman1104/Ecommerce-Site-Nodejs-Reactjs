const express = require("express");
const { Rate, User } = require("../db");

const { Product } = require("../db/models/Product");
const { validateReqBody, getErrors, getCommentsFromID } = require("../helpers");
const auth = require("./middlewares/auth");

const productRouter = express.Router();
// Create Product
productRouter.post("/api/product", async (req, res) => {
  const {
    productName,
    description,
    unitPrice,
    categoryID,
    stock,
    warranty,
    userType,
    imagePath,
  } = req.body;

  if (
    !validateReqBody(
      productName,
      description,
      unitPrice,
      categoryID,
      stock,
      warranty,
      imagePath
    )
  ) {
    return res.status(401).send({
      status: false,
      type: "INVALID",
      error: "invalid request body",
    });
  }
  try {
    if (userType != 2) {
      throw new Error("invalid user type");
    }

    const newProduct = new Product({
      productName,
      description,
      unitPrice,
      categoryID,
      stock,
      warranty,
      rate: 0,
      rateCount: 0,
      rateTotal: 0,
      imagePath,
    });

    await newProduct.save();
    res.send({ status: true, product: newProduct });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// DELETE products.
productRouter.delete("/api/product/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(401).send({
      status: false,
      type: "INVALID",
      error: "Invalid request parameter, id",
    });
  }
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).send({ status: false, id });
    }
    return res.status(201).send({ status: true, id });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// GET all products
productRouter.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    return res.send({ status: true, products });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// GET a product
productRouter.get("/api/product/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(401).send({
      status: false,
      type: "INVALID",
      error: "Invalid request parameter, id",
    });
  }

  try {
    let product = await Product.findById(id); //Pass the id of the product that is wanted
    if (!product) {
      throw Error(`no product found ${id}`);
    }
    product = product.toObject();
    const commentIDs = product.comments;
    const comments = await getCommentsFromID(commentIDs);

    product.comments = comments;

    return res.send({ status: true, product });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

productRouter.get("/api/category/product/:category", async (req, res) => {
  const { category } = req.params;

  if (!category) {
    return res.status(401).send({
      status: false,
      type: "INVALID",
      error: "Invalid request parameter, id",
    });
  }

  try {
    // find details of a product
    const products = await Product.find({ categoryID: category }); //Pass the id of the product that is wanted

    if (!products) {
      throw Error(`no product found ${category}`);
    }

    return res.send({ status: true, products });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

productRouter.post("/api/rate/product", auth, async (req, res) => {
  try {
    const { id, input_rate } = req.body;
    const user = req.user;

    let newRate = new Rate({
      userID: user._id,
      productID: id,
      rate: input_rate,
    });

    let prevRate = 0;
    let isFound = false;
    for (ur of user.rates) {
      const ratedProd = await Rate.findById(ur);
      if (ratedProd && ratedProd.productID === id) {
        prevRate = ratedProd.rate;
        ratedProd.rate = input_rate;
        await Rate.findByIdAndUpdate(ur, ratedProd, { new: true });
        isFound = true;
      }
    }

    let aproduct = await Product.findById(id);
    if (!aproduct) {
      throw new Error(`cannot find product ${id}`);
    }

    let totalCount = aproduct.get("rateCount");
    let totalRate = aproduct.get("rateTotal");
    let overallRating;
    if (!isFound) {
      user.rates.push(newRate._id);
      totalCount += parseInt(input_rate);
      totalRate += 1;
      overallRating = totalCount / totalRate;
    } else {
      totalCount = totalCount + (input_rate - prevRate);
      overallRating = totalCount / totalRate;
    }

    aproduct = aproduct.toObject();
    aproduct.rateCount = totalCount;
    aproduct.rateTotal = totalRate;
    aproduct.rate = overallRating;

    const newProduct = await Product.findByIdAndUpdate(id, aproduct, {
      new: true,
    });
    
    await User.findByIdAndUpdate(user._id, user, { new: true });

    if (!isFound) {
      newRate.save();
    }
    return res.send({ status: true, product: newProduct });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

module.exports = { productRouter };
