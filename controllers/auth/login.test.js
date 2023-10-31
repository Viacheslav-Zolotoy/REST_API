require("dotenv").config();
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const { User } = require("../../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { DB_TEST } = process.env;

describe("Test login", () => {
  beforeAll(async () => {
    await mongoose
      .connect(DB_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("DB connected"))
      .catch((err) => console.log(err));
  });

  //   it("should return 200 status for login", async () => {
  //     expect(1 + 1).toBe(2);
  //   });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should log in a user and return a token and status 200", async () => {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: "test@example.com",
      password: hashedPassword,
      name: "Test User",
      subscription: "starter",
    });

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data.token");
    expect(response.body.data).toHaveProperty("user");
    const userObject = response.body.data.user;
    expect(userObject).toHaveProperty("email");
    expect(typeof userObject.email).toBe("string");
    expect(userObject).toHaveProperty("subscription");
    expect(typeof userObject.subscription).toBe("string");

    const decoded = jwt.verify(
      response.body.data.token,
      process.env.SECRET_KEY
    );
    expect(decoded.id).toBe(user.id);
  });

  it("should return an error for invalid login operations", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "invalid@example.com", password: "invalidpassword" });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Email or password is wrong"
    );
  });
});
