const request = require("supertest");
const app = require("../src");
const { User } = require("../src/db");
const mongoose = require("mongoose");
const { MONGO_OPTIONS } = require("../src/config");
const { dropAllCollections, removeAllCollections } = require("./helpers");
jest.setTimeout(60000);

const MONGO_TEST_URI = `mongodb://admin2:${encodeURIComponent(
  "example"
)}@localhost:27018/test2`;
module.exports = MONGO_TEST_URI;

let testUser = {
  userEmail: "king@james.king23",
  password: "king!",
  username: "lacavs",
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

describe("GET /admin user", () => {
  it("should get all users", async (done) => {
    const url = "/admin/users";
    try {
      const result = await request(app).get(url);

      // status check
      expect(result.status).toEqual(200);
      expect(result.body.status).toEqual(true);

      // check result body
      expect(typeof result.body).toBe("object");
      expect(result.body.hasOwnProperty("users")).toBe(true);
      expect(typeof result.body.users).toBe("object");
      expect(result.body.hasOwnProperty("status")).toBe(true);

      const { userEmail, username } = testUser;
      expect(result.body.users[0]).toMatchObject({ userEmail, username });

      done();
    } catch (error) {
      done(error);
    }
  });

  it("should get all comments", async (done) => {
    const url = "/api/comments";
    try {
      const result = await request(app).get(url);

      // status check
      expect(result.status).toEqual(200);
      expect(result.body.status).toEqual(true);
      expect(result.body.comments).toEqual([]);

      done();
    } catch (error) {
      done(error);
    }
  });

  it("should add comment ", async (done) => {
    let url = "/api/product";
    try {
      const testProduct = {
        productName: "test",
        description: "test",
        unitPrice: 20,
        categoryID: 3,
        stock: 20,
        warranty: 1,
        userType: 2,
        imagePath: "test",
      };

      let result = await request(app).post(url).send(testProduct);

      const product = result.body.product;
      url = "/api/comment";
      const c = {
        productID: product._id,
        content: "comment",
        token: testUser.token,
      };

      result = await request(app).post(url).send(c);
      // status check
      expect(result.status).toEqual(200);
      expect(result.body.status).toEqual(true);
      expect(result.body.comments[0].owner).toEqual(testUser.username);
      expect(result.body.comments[0].content).toEqual(c.content);

      done();
    } catch (error) {
      done(error);
    }
  });

  it("should get all products", async (done) => {
    const url = "/api/products";
    try {
      const result = await request(app).get(url);

      // status check
      expect(result.status).toEqual(200);
      expect(result.body.status).toEqual(true);
      expect(result.body.products).toEqual([]);

      done();
    } catch (error) {
      done(error);
    }
  });

  it("should get all products2", async (done) => {
    const url = "/api/product";
    try {
      const testProduct = {
        productName: "test",
        description: "test",
        unitPrice: 20,
        categoryID: 3,
        stock: 20,
        warranty: 1,
        userType: 2,
        imagePath: "test",
      };

      const result = await request(app).post(url).send(testProduct);
      const resultProduct = result.body.product;
      delete resultProduct._id;
      delete resultProduct.comments;
      delete resultProduct.previousPrice;
      delete resultProduct.rate;
      delete resultProduct.rateCount;
      delete resultProduct.rateTotal;

      delete testProduct.userType;

      // status check
      expect(result.status).toEqual(200);
      expect(result.body.status).toEqual(true);
      expect(result.body.product).toEqual(testProduct);

      done();
    } catch (error) {
      done(error);
    }
  });
});
