module.exports = {
  ...require("./models/User"),
  ...require("./models/Product"),
  ...require("./models/Order"),
  ...require("./models/Rate"),
  ...require("./connect"),
};
