const express = require("express");
const { User } = require("../db/");
const { getErrors } = require("../helpers");
const userRouter = express.Router();
const bcrypt = require("bcrypt");

// Get a user based on user id
userRouter.get("/api/user/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    let user = await User.findById(_id);
    if (!user) {
      throw new Error("no such a user");
    }
    user = user.toObject();
    delete user.password;
    res.send({ status: true, user });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// Update user.
userRouter.put("/api/user/:id", async (req, res) => {
  const { userEmail, password, username, address } = req.body;
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error(`no such a user ${id}`);
    }
    const updated = { userEmail, password, username, address };
    let userObj = user.toObject();
    for (let i in updated) {
      if (updated[i] != undefined) {
        userObj[i] = updated[i];
      }
    }
    const salt = await bcrypt.genSalt(8);
    userObj.password = await bcrypt.hash(userObj.password, salt);
    userObj = await User.findByIdAndUpdate(id, userObj, { new: true });
    if (!userObj) {
      throw new Error(`cannot find user ${id}`);
    }
    userObj = userObj.toObject();
    delete userObj.password;
    res.send({ status: true, user: userObj });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

userRouter.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.send({ status: true, users });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

module.exports = { userRouter };
