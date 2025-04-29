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
const middleware_1 = require("./middleware");
const db_1 = require("../db");
const zod_1 = __importDefault(require("zod"));
const router = express_1.default.Router();
const updateBody = zod_1.default.object({
    password: zod_1.default.string().optional(),
    firstName: zod_1.default.string().optional(),
    lastName: zod_1.default.string().optional(),
});
router.put('/', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const pass = updateBody.safeParse(body);
    if (!(pass.success)) {
        res.json({
            message: "Error while updating information"
        });
        return;
    }
    const userid = req.userId;
    const updateinfo = yield db_1.User.findOneAndUpdate({ _id: userid }, body, { new: true });
    console.log(updateinfo);
    if (updateinfo) {
        res.status(200).json({
            message: "Updated successfully"
        });
        return;
    }
    res.status(411).json({
        message: "Error while updating information"
    });
    return;
}));
router.get('/bulk', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.filter;
    console.log(query);
    const finduser = yield db_1.User.find({ $or: [{ firstName: query }, { lastName: query }] });
    if (finduser) {
        res.status(200).json({
            users: [{
                    firstName: finduser[0].lastName,
                    lastName: finduser[0].firstName,
                    _id: finduser[0]._id
                }]
        });
    }
}));
exports.default = router;
