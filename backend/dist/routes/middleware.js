"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(403).json({});
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECERET);
        if (!(decoded.userid == undefined)) {
            req.userId = decoded.userid;
            next();
        }
        else {
            res.json({ "m": "nothing" });
            return;
        }
    }
    catch (err) {
        res.status(403).json({});
        return;
    }
};
exports.authMiddleware = authMiddleware;
