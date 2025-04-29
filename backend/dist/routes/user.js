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
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const zod_1 = require("zod");
const config_1 = require("../config");
const update_1 = __importDefault(require("./update"));
const zodSchema = zod_1.z.object({
    username: zod_1.z.string().email(),
    firstName: zod_1.z.string().min(2).max(50),
    lastName: zod_1.z.string().min(2).max(50),
    password: zod_1.z.string().min(2).max(20)
});
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const info = zodSchema.safeParse(body);
    if (!info.success) {
        res.json({ message: "Email already taken / Incorrect inputs" });
        return;
    }
    else if (info.success) {
        try {
            const existinguser = yield db_1.User.findOne({
                username: info.data.username
            });
            if (existinguser) {
                res.json({ message: "Email already taken / Incorrect inputs" });
                return;
            }
            const usercreated = yield db_1.User.create({
                firstName: info.data.firstName,
                lastName: info.data.lastName,
                password: info.data.password,
                username: info.data.username
            });
            const userid = usercreated._id;
            const token = jsonwebtoken_1.default.sign({ userid }, config_1.JWT_SECERET);
            res.json({
                message: "User created successfully",
                token: token
            });
            return;
        }
        catch (e) {
            res.json({
                message: "something went wrong try again" + e
            });
            return;
        }
    }
}));
const signinbody = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string()
});
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqbody = signinbody.safeParse(req.body);
    if (!reqbody.success) {
        res.json({
            "message": "incorrect input"
        });
        return;
    }
    const userExist = yield db_1.User.findOne({
        username: reqbody.data.username,
        password: reqbody.data.password
    });
    const userid = userExist === null || userExist === void 0 ? void 0 : userExist._id;
    const token = jsonwebtoken_1.default.sign({ userid }, config_1.JWT_SECERET);
    if (userExist) {
        res.json({
            token: token
        });
    }
    else {
        res.json({
            "message": "user not found"
        });
    }
}));
router.use('/', update_1.default);
exports.default = router;
