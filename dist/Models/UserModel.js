"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.userModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const validateEmail = (value) => {
    return validator_1.default.isEmail(value);
};
const Userschema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "email required"],
        unique: true,
        validate: {
            validator: validateEmail,
            message: "Invalid email format",
        },
    },
    password: {
        type: String,
        required: [true, "password required"],
        minlength: 8,
    },
    avatar: {
        type: Buffer,
    },
    tokens: [
        {
            token: {
                type: String,
                required: [true, "token required"],
            },
        },
    ],
}, {
    timestamps: true,
});
Userschema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified("password")) {
            user.password = yield bcrypt_1.default.hash(user.password, 8);
        }
        next();
    });
});
Userschema.methods.generateToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = this;
            const SECRET_TOKEN = process.env.SECRET_TOKEN;
            const token = jsonwebtoken_1.default.sign({ _id: user._id }, SECRET_TOKEN);
            user.tokens = user.tokens.concat({ token: token });
            yield user.save();
            return token;
        }
        catch (error) {
            throw new Error("Invalid token");
        }
    });
};
Userschema.statics.getUserCredentials = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield exports.userModel.findOne({ email: email });
        if (!user) {
            throw new Error("no user found");
        }
        const passwordIsMatched = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordIsMatched) {
            throw new Error("password error");
        }
        return user;
    });
};
exports.userModel = mongoose_1.default.model("users", Userschema, "users");
//# sourceMappingURL=UserModel.js.map