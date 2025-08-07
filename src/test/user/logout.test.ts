import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
jest.setTimeout(30000);

describe("User Profile API", () => {
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "123456",
  };

  let userAccessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI!, {});
    }
  });

  beforeEach(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    if (res.statusCode !== 200) {
      console.log("LOGIN ERROR:", res.body, res.text);
    }
    userAccessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/auth/logout", () => {

    // it("should return 401 when no refresh token is provided", async () => {
    //   const res = await request(app)
    //     .post("/api/auth/logout")
    //     .set("Authorization", `Bearer ${userAccessToken}`)


    //   expect(res.statusCode).toBe(400);
    //   expect(res.body).toHaveProperty("error", "Missing refresh token");
    //   expect(res.body).toHaveProperty("error", "UnAuthorized!!!");
    // });

    it("should return 200 when refresh token is provided", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${userAccessToken}`)
        .send({ refreshToken });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Logged Out Success!");
    });

    
  });
});
