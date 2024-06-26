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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
require("./database/connection");
const app = (0, express_1.default)();
const PORT = 5000 || 3000 || 5001;
dotenv.config();
app.use(express_1.default.json());
const adminSeeder_1 = __importDefault(require("./adminSeeder"));
const categoryController_1 = __importDefault(require("./controllers/categoryController"));
const cartRoute_1 = __importDefault(require("./routes/cartRoute"));
const categoryRoute_1 = __importDefault(require("./routes/categoryRoute"));
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
app.use("", userRoute_1.default);
app.use("/admin/product", productRoute_1.default);
app.use("/admin/category", categoryRoute_1.default);
app.use('/customer/cart', cartRoute_1.default);
app.use("/order", orderRoute_1.default);
//Admin Seeder
(0, adminSeeder_1.default)();
app.get("/", (req, res) => {
    res.send("Welcome to server Page!");
});
app.listen(PORT, () => {
    categoryController_1.default.seedCategory();
    console.log("Listening on port " + PORT);
});
