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
exports.User = exports.Account = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect("mongodb://localhost:27017/?replicaSet=rs");
        console.log("connected");
    });
}
connect();
const UserSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true }
});
const AccountSchema = new mongoose_1.default.Schema({
    username: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: "User" },
    balance: { type: Number, required: true }
});
exports.Account = mongoose_1.default.model("Account", AccountSchema);
exports.User = mongoose_1.default.model("User", UserSchema);
