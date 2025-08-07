"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
jest.setTimeout(30000);
describe("Upload Image API", () => {
    const testUser = {
        name: "Test User",
        email: "test@example.com",
        password: "123456",
    };
    let userAccessToken;
    let userId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        if (mongoose_1.default.connection.readyState === 0) {
            yield mongoose_1.default.connect(process.env.MONGO_URI, {});
        }
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({ email: testUser.email, password: testUser.password });
        if (res.statusCode !== 200) {
            console.log("LOGIN ERROR:", res.body, res.text);
        }
        userAccessToken = res.body.accessToken;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
    describe("POST /api/images/upload", () => {
        it("should return 401 when no token is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).post("/api/images/upload");
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty("error", "UnAuthorized!!!");
        }));
        it("should return 400 when no image file is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .post("/api/images/upload")
                .set("Authorization", `Bearer ${userAccessToken}`)
                .field("description", "Test description");
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty("error", "Missing image file");
        }));
        it("should successfully upload image with valid data", () => __awaiter(void 0, void 0, void 0, function* () {
            const imagePath = path_1.default.join(__dirname, "../sample.jpg");
            const res = yield (0, supertest_1.default)(app_1.default)
                .post("/api/images/upload")
                .set("Authorization", `Bearer ${userAccessToken}`)
                .attach("image", imagePath)
                .field("description", "Test image description");
            if (res.statusCode !== 201) {
                console.log("UPLOAD ERROR:", res.body, res.text);
            }
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty("message", "image uploaded. Awaiting admin approval!");
            expect(res.body).toHaveProperty("image");
            expect(res.body.image).toHaveProperty("user");
            expect(res.body.image).toHaveProperty("imageUrl");
            expect(res.body.image).toHaveProperty("publicId");
            expect(res.body.image).toHaveProperty("description", "Test image description");
            expect(res.body.image).toHaveProperty("visibility", "public");
            expect(res.body.image).toHaveProperty("status", "pending");
        }));
    });
});
