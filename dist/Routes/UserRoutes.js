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
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const UserModel_1 = require("../Models/UserModel");
exports.UserRoutes = express_1.default.Router();
exports.UserRoutes.use((0, cors_1.default)());
exports.UserRoutes.use(express_1.default.json());
exports.UserRoutes.post("/api/user/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedBody = req.body;
        if (!parsedBody.email || !parsedBody.password) {
            throw new Error("Email and password are required");
        }
        const newUser = new UserModel_1.userModel(parsedBody);
        const token = yield newUser.generateToken();
        const savedUser = yield newUser.save();
        res.status(200).send({ savedUser, token });
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
}));
exports.UserRoutes.post("/api/user/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.userModel.getUserCredentials(req.body.email, req.body.password);
        if (!user) {
            return res.status(500).send({ Error: "no user found" });
        }
        const token = yield user.generateToken();
        res.status(200).send({ user, token });
    }
    catch (error) {
        res.status(400).send({ Error: error.message });
    }
}));
//# sourceMappingURL=UserRoutes.js.map