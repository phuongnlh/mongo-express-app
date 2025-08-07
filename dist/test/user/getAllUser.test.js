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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
    let adminAccessToken;
    let userAccessToken;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        if (mongoose_1.default.connection.readyState === 0) {
            yield mongoose_1.default.connect(process.env.MONGO_URI, {});
        }
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const resAdmin = yield (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({ email: testAdminUser.email, password: testAdminUser.password });
        if (resAdmin.statusCode !== 200) {
            console.log("LOGIN ERROR:", resAdmin.body, resAdmin.text);
        }
        adminAccessToken = resAdmin.body.accessToken;
        const resUser = yield (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({ email: testUser.email, password: testUser.password });
        if (resUser.statusCode !== 200) {
            console.log("LOGIN ERROR:", resUser.body, resUser.text);
        }
        userAccessToken = resUser.body.accessToken;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
    describe("GET /api/admin/users", () => {
        it("should return 403 when no token is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).get("/api/admin/users");
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty("error", "UnAuthorized!!!");
        }));
        it("should return 403 when role is not admin", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .get("/api/admin/users")
                .set("Authorization", `Bearer ${userAccessToken}`);
            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty("message", "Access dinied. Admin only");
        }));
        it("should return user profile with all expected fields", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .get("/api/admin/users")
                .set("Authorization", `Bearer ${adminAccessToken}`);
            expect(res.statusCode).toBe(200);
        }));
    });
});
