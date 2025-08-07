// import request from "supertest";
// import app from "../../app";
// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();
// jest.setTimeout(30000);

// describe("User Profile API", () => {
//   const testUser = {
//     name: "Test User",
//     email: "test@example.com",
//     password: "123456",
//   };

//   let userAccessToken: string;

//   beforeAll(async () => {
//     if (mongoose.connection.readyState === 0) {
//       await mongoose.connect(process.env.MONGO_URI!, {});
//     }
//   });

//   beforeEach(async () => {
//     const res = await request(app)
//       .post("/api/auth/login")
//       .send({ email: testUser.email, password: testUser.password });
//     if (res.statusCode !== 200) {
//       console.log("LOGIN ERROR:", res.body, res.text);
//     }
//     userAccessToken = res.body.accessToken;
//   });

//   afterAll(async () => {
//     await mongoose.connection.close();
//   });

//   describe("GET /api/user/me", () => {
//     it("should return 401 when no token is provided", async () => {
//       const res = await request(app).get("/api/user/me");

//       expect(res.statusCode).toBe(401);
//       expect(res.body).toHaveProperty("error", "UnAuthorized!!!");
//     });

//     it("should return 401 when token format is incorrect", async () => {
//       const res = await request(app)
//         .get("/api/user/me")
//         .set("Authorization", userAccessToken); // Missing "Bearer " prefix

//       expect(res.statusCode).toBe(401);
//       expect(res.body).toHaveProperty("error", "UnAuthorized!!!");
//     });

//     it("should return user profile with all expected fields", async () => {
//       const res = await request(app)
//         .get("/api/user/me")
//         .set("Authorization", `Bearer ${userAccessToken}`);

//       expect(res.statusCode).toBe(200);
//       expect(res.body.user).toHaveProperty("id");
//       expect(res.body.user).toHaveProperty("email");
//       expect(typeof res.body.user.id).toBe("string");
//       expect(typeof res.body.user.email).toBe("string");
//     });
//   });
// });
