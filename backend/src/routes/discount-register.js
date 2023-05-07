/*
  discount-register serves endpoints that allow users to register discount
  for specific products.
*/

const express = require("express");
const { Product } = require("../db/models/Product");
const { getErrors } = require("../helpers");
const auth = require("./middlewares/auth");

const registerRouter = express.Router();

// register for a given product's discount
registerRouter.post("/api/register", auth, async (req, res) => {
  const user = req.user;
  const { productID } = req.body;

  try {
    let prod = await Product.findById(productID);
    if (!prod) {
      throw new Error(`cannot find product ${productID}`);
    }
    if (!prod.registeredUser) {
      console.log(prod);
      throw new Error(`cannot find registered user array for ${productID}`);
    }
    let userID = JSON.stringify(user._id);
    for (uid of prod.registeredUser) {
      uid = JSON.stringify(uid);
      if (uid == userID) {
        return res.status(401).send({
          status: false,
          error: `user: ${user._id} already registered to product: ${productID}`,
        });
      }
    }
    prod.registeredUser.push(user._id);
    await prod.save();

    res.send({ status: true, users: prod.registeredUser });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

module.exports = { registerRouter };
