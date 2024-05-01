"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = __importDefault(require("../controllers/cartController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.route("/")
    .post(authMiddleware_1.default.isAthenticated, cartController_1.default.addToCart)
    .get(authMiddleware_1.default.isAthenticated, cartController_1.default.getMyCarts);
router.route("/:productId")
    .delete(authMiddleware_1.default.isAthenticated, cartController_1.default.deleteCartItem)
    .patch(authMiddleware_1.default.isAthenticated, cartController_1.default.updadteCartItem);
exports.default = router;
