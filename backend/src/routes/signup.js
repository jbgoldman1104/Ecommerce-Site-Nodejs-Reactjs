const express = require("express");
const { User } = require("../db");
const { validateReqBody, getErrors } = require("../helpers");

const signupRouter = express.Router();

signupRouter.post("/api/signup", async (req, res) => {
  const { userEmail, password, username, userType, address } = req.body;

  if (!validateReqBody(userEmail, password, username)) {
    return res
      .status(401)
      .send({ status: false, type: "INVALID", error: "invalid request body" });
  }

  try {
    // Create user object to save
    let newUser;
    if (typeof userType === "number") {
      newUser = new User({ userEmail, password, username, address, userType });
    } else {
      newUser = new User({ userEmail, password, username, address });
    }

    // Get JWT for the user and update token field of the new user.
    // Then, save updated user.
    const token = await newUser.getJWT();
    newUser.token = token;
    await newUser.save();

    // Convert User to object in order to delete password field.
    // So that client does not see user's password while returning through response.
    newUser = newUser.toObject();
    delete newUser.password;

    res.send({ status: true, user: newUser });
  } catch (error) {
    const validationErr = getErrors(error);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

module.exports = { signupRouter };
