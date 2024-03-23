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
const cors_1 = __importDefault(require("cors"));
const UserRoutes_1 = require("./Routes/UserRoutes");
const db_1 = require("./database/db");
const app = (0, express_1.default)();
(0, db_1.dbConnection)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(UserRoutes_1.UserRoutes);
const PORT = 5000;
app.listen(PORT, () => {
    console.log("The app is up and listening on port", PORT);
});
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.dbTermination)();
    process.exit(0);
}));
//# sourceMappingURL=index.js.map