const express = require("express");
const { User, Product } = require("../db/");
const { getErrors, validateReqBody } = require("../helpers");
const { sendMail } = require("../mail");
const auth = require("./middlewares/auth");
const managerRouter = express.Router();

managerRouter.post("/signup", async (req, res) => {
  const { userEmail, password, username, userType } = req.body;
  if (userType == undefined || userType <= 0 || userType > 2) {
    return res
      .status(401)
      .send({ status: false, type: "INVALID", error: "invalid userType" });
  }

  if (!validateReqBody(userEmail, password, username)) {
    return res
      .status(401)
      .send({ status: false, type: "INVALID", error: "invalid request body" });
  }

  try {
    // Create user object to save
    let newUser = new User({ userEmail, password, username });

    // Get JWT for the user and update token field of the new user.
    // Then, save updated user.
    const token = await newUser.getJWT();
    newUser.token = token;
    newUser.userType = userType;
    await newUser.save();

    // Convert User to object in order to delete password field.
    // So that client does not see user's password while returning through response.
    newUser = newUser.toObject();
    delete newUser.password;

    res.send({ status: true, user: newUser });
  } catch (error) {
    console.log("error: ", error.message);
    const validationErr = getErrors(error);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

managerRouter.put("/sm/product/:_id", auth, async (req, res) => {
  const user = req.user;
  const {
    stock,
    productName,
    description,
    unitPrice,
    previousPrice,
    categoryID,
    warranty,
    rate,
  } = req.body;
  const { _id } = req.params;

  if (!_id) {
    return res.status(401).send({
      status: false,
      type: "INVALID",
      error: "invalid request body",
    });
  }
  try {
    if (!user || user.userType != 1) {
      throw new Error("Invalid user authentication");
    }

    const newProduct = {
      stock,
      productName,
      description,
      unitPrice,
      previousPrice,
      categoryID,
      warranty,
      rate,
    };

    let product = await Product.findById(_id);
    if (!product) {
      return res.status(404).send({ status: false, _id });
    }

    const productObj = product.toObject();
    for (let i in newProduct) {
      if (newProduct[i] != undefined) {
        productObj[i] = newProduct[i];
      }
    }
    await Product.findByIdAndUpdate(_id, productObj);

    if (previousPrice > 0) {
      mailText = `Discount on ${product.productName} is started!\n\n`;
      for (uid of product.registeredUser) {
        let user_ = await User.findById(uid);
        if (user_) {
          user_ = user_.userEmail;
        }
        sendMail(user_, `Discount on ${product.productName}`, mailText);
      }
    }

    return res.status(201).send({ status: true, product: productObj });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

managerRouter.put("/pm/product/:_id", auth, async (req, res) => {
  const {
    stock,
    productName,
    description,
    unitPrice,
    categoryID,
    warranty,
    rate,
  } = req.body;
  const { _id } = req.params;
  const user = req.user;

  if (!_id) {
    return res.status(401).send({
      status: false,
      type: "INVALID",
      error: "invalid request body",
    });
  }
  try {
    if (!user || user.userType != 2) {
      throw new Error("Invalid user authentication");
    }

    const newProduct = {
      stock,
      productName,
      description,
      unitPrice,
      categoryID,
      warranty,
      rate,
    };

    let product = await Product.findById(_id);
    if (!product) {
      return res.status(404).send({ status: false, _id });
    }

    const productObj = product.toObject();
    for (let i in newProduct) {
      if (newProduct[i] != undefined) {
        productObj[i] = newProduct[i];
      }
    }
    await Product.findByIdAndUpdate(_id, productObj);

    return res.status(201).send({ status: true, product: productObj });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

module.exports = { managerRouter };
