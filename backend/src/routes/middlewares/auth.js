const jwt = require("jsonwebtoken");
const { User } = require("../../db");

const auth = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) {
      throw new Error("no token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await (await User.findById(decoded.id)).toObject();
    if (!user) {
      throw new Error("no such a user");
    }

    delete user.password;
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ status: false, type: "AUTH", error: error.message });
  }
};

module.exports = auth;
