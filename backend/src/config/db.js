const {
  MONGO_USERNAME = "admin",
  MONGO_PASSWORD = "example",
  MONGO_HOST = "localhost",
  MONGO_PORT = 27018,
  MONGO_DATABASE = "test",
} = process.env;

const MONGO_URI = `mongodb://${MONGO_USERNAME}:${encodeURIComponent(
  MONGO_PASSWORD
)}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;

const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

module.exports = {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DATABASE,
  MONGO_URI,
  MONGO_OPTIONS,
};
