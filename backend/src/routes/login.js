const express = require("express");
const { User } = require("../db/");
const { validateReqBody, getErrors } = require("../helpers");

const loginRouter = express.Router();

loginRouter.post("/api/login", async (req, res) => {
  const { userEmail, password } = req.body;
  if (!validateReqBody(userEmail, password)) {
    return res
      .status(401)
      .send({ status: false, type: "INVALID", error: "invalid request body" });
  }

  try {
    // Check existence of the user in the DB.
    const user = await User.findByCredentials(userEmail, password, true);

    // If user exists, generate token for the user and assign it
    const token = await user.getJWT();

    res.send({ status: true, user });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

module.exports = { loginRouter };
