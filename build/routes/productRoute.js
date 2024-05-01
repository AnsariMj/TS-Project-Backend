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
const express_1 = __importDefault(require("express"));
const productController_1 = __importDefault(require("../controllers/productController"));
const authMiddleware_1 = __importStar(require("../middleware/authMiddleware"));
const multerMiddeware_1 = require("../middleware/multerMiddeware");
const upload = (0, multerMiddeware_1.multer)({ storage: multerMiddeware_1.storage });
const router = express_1.default.Router();
router.route("/")
    .post(authMiddleware_1.default.isAthenticated, authMiddleware_1.default.restrictTo(authMiddleware_1.Role.Admin), upload.single('image'), productController_1.default.addProduct)
    .get(productController_1.default.getAllProducts);
router.route("/:id").get(productController_1.default.getSingelProduct).delete(authMiddleware_1.default.isAthenticated, authMiddleware_1.default.restrictTo(authMiddleware_1.Role.Admin), productController_1.default.deleteProduct);
exports.default = router;
