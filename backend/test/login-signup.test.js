const request = require("supertest");
const app = require("../src");
const mongoose = require("mongoose");
const { dropAllCollections, removeAllCollections } = require("./helpers");
jest.setTimeout(50000);

const { User } = require("../src/db");
const MONGO_TEST_URI = require("./user.test");
const { MONGO_OPTIONS } = require("../src/config");

let testUser = {
  userEmail: "loginking@james.king23",
  password: "loginking!",
  username: "loginlacavs",
};

beforeAll(async () => {
  await mongoose.connect(MONGO_TEST_URI, MONGO_OPTIONS);
});

afterAll(async () => {
  await dropAllCollections();
  await mongoose.connection.close();
});

beforeEach(async () => {
  try {
    // Create user object to save
    let newUser = new User(testUser);
    const token = await newUser.getJWT();
    newUser.token = token;
    await newUser.save();
    testUser["_id"] = newUser._id;
    testUser["token"] = newUser.token;
  } catch (error) {
    console.error("error in creating user", error);
  }
});

afterEach(async () => {
  try {
    await removeAllCollections();
  } catch (error) {
    console.error("error in deleting user", error);
  }
});

describe("POST /api for login and sigup", () => {
  // CHECK LOGIN ENDPOINTS
  it("should login", async (done) => {
    const url = "/api/login";
    try {
      const result = await request(app).post(url).send(testUser);

      // status check
      expect(result.status).toEqual(200);
      expect(result.body.status).toEqual(true);

      const { userEmail, username } = testUser;
      expect(result.body.user).toMatchObject({ userEmail, username });

      done();
    } catch (error) {
      done(error);
    }
  });

  it("shouldn't login", async (done) => {
    const url = "/api/login";
    try {
      const result = await request(app).post(url).send({});

      // status check
      expect(result.status).toEqual(401);
      expect(result.body.status).toEqual(false);

      done();
    } catch (error) {
      done(error);
    }
  });

  it("shouldn't login with empty body", async (done) => {
    const url = "/api/login";
    try {
      const result = await request(app).post(url);

      // status check
      expect(result.status).toEqual(401);
      expect(result.body.status).toEqual(false);

      done();
    } catch (error) {
      done(error);
    }
  });

  // CHECK SIGNUP ENDPOINTS
  it("should signup", async (done) => {
    const url = "/api/signup";

    try {
      const result = await request(app).post(url).send({
        userEmail: "tester",
        password: "_TESTER_",
        username: "tester",
      });

      // status check
      expect(result.status).toEqual(200);
      expect(result.body.status).toEqual(true);

      done();
    } catch (error) {
      done(error);
    }
  });

  it("shouldn't signup", async (done) => {
    const url = "/api/signup";

    try {
      const result = await request(app).post(url).send(testUser);

      // status check
      expect(result.status).toEqual(401);
      expect(result.body.status).toEqual(false);

      done();
    } catch (error) {
      done(error);
    }
  });
});
