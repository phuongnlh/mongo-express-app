// import request from "supertest";
// import app from "../../app";
// import mongoose from "mongoose";
// import { Image } from "../../models/Image";
// import path from "path";
// import dotenv from "dotenv";

// dotenv.config();
// jest.setTimeout(30000);

// describe("Upload Image API", () => {
//   const testUser = {
//     name: "Test User",
//     email: "test@example.com",
//     password: "123456",
//   };

//   let userAccessToken: string;
//   let userId: string;

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

//   describe("POST /api/images/upload", () => {
//     it("should return 401 when no token is provided", async () => {
//       const res = await request(app).post("/api/images/upload");

//       expect(res.statusCode).toBe(401);
//       expect(res.body).toHaveProperty("error", "UnAuthorized!!!");
//     });

//     it("should return 400 when no image file is provided", async () => {
//       const res = await request(app)
//         .post("/api/images/upload")
//         .set("Authorization", `Bearer ${userAccessToken}`)
//         .field("description", "Test description");

//       expect(res.statusCode).toBe(400);
//       expect(res.body).toHaveProperty("error", "Missing image file");
//     });

//     it("should successfully upload image with valid data", async () => {
//       const imagePath = path.join(__dirname, "../sample.jpg");

//       const res = await request(app)
//         .post("/api/images/upload")
//         .set("Authorization", `Bearer ${userAccessToken}`)
//         .attach("image", imagePath)
//         .field("description", "Test image description");

//       if (res.statusCode !== 201) {
//         console.log("UPLOAD ERROR:", res.body, res.text);
//       }

//       expect(res.statusCode).toBe(201);
//       expect(res.body).toHaveProperty(
//         "message",
//         "image uploaded. Awaiting admin approval!"
//       );
//       expect(res.body).toHaveProperty("image");
//       expect(res.body.image).toHaveProperty("user");
//       expect(res.body.image).toHaveProperty("imageUrl");
//       expect(res.body.image).toHaveProperty("publicId");
//       expect(res.body.image).toHaveProperty(
//         "description",
//         "Test image description"
//       );
//       expect(res.body.image).toHaveProperty("visibility", "public");
//       expect(res.body.image).toHaveProperty("status", "pending");
//     });
//   });
// });
