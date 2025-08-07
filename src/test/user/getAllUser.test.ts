import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
jest.setTimeout(30000);

describe("Get All User Profile API", () => {
  const testAdminUser = {
    name: "Admin User",
    email: "admin@example.com",
    password: "123456",
  };
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "123456",
  };

  let adminAccessToken: string;

  let userAccessToken: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI!, {});
    }
  });

  beforeEach(async () => {
    const resAdmin = await request(app)
      .post("/api/auth/login")
      .send({ email: testAdminUser.email, password: testAdminUser.password });
    if (resAdmin.statusCode !== 200) {
      console.log("LOGIN ERROR:", resAdmin.body, resAdmin.text);
    }
    adminAccessToken = resAdmin.body.accessToken;

    const resUser = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    if (resUser.statusCode !== 200) {
      console.log("LOGIN ERROR:", resUser.body, resUser.text);
    }
    userAccessToken = resUser.body.accessToken;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /api/admin/users", () => {
    it("should return 403 when no token is provided", async () => {
      const res = await request(app).get("/api/admin/users");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("error", "UnAuthorized!!!");
    });

    it("should return 403 when role is not admin", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${userAccessToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message", "Access dinied. Admin only");
    });

    it("should return user profile with all expected fields", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(res.statusCode).toBe(200);
    });
  });
});
