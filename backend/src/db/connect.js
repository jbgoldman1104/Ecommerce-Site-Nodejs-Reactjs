const mongoose = require("mongoose");
const { MONGO_URI, MONGO_OPTIONS } = require("../config");

const connectDB = async (uri) => {
  try {
    if (!uri) {
      await mongoose.connect(MONGO_URI, MONGO_OPTIONS);
    } else {
      await mongoose.connect(uri, MONGO_OPTIONS);
    }
    console.log("Connected to DB!");
  } catch (error) {
    console.log("Cannot connect to DB:", error);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("Closed DB connection!");
  } catch (error) {
    console.log("Cannot close connection of DB:", e);
  }
};

module.exports = { connectDB, disconnectDB };
