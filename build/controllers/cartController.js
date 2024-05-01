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
const Cart_1 = __importDefault(require("../database/models/Cart"));
const Category_1 = __importDefault(require("../database/models/Category"));
const Product_1 = __importDefault(require("../database/models/Product"));
class CartController {
    //Add to cart
    addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { quantity, productId } = req.body;
            if (!quantity) {
                res.status(404).json({
                    messagea: " Please Provide Quantity and user ID"
                });
            }
            let cartItem = yield Cart_1.default.findOne({
                where: {
                    productId,
                    userId
                }
            });
            if (cartItem) {
                cartItem.quantity += quantity;
                yield cartItem.save();
            }
            else {
                //insert items to the cart (creating cart for specific product)
                cartItem = yield Cart_1.default.create({
                    userId,
                    productId,
                    quantity,
                });
            }
            res.status(200).json({
                message: "Produt added to cart",
                data: cartItem
            });
        });
    }
    //Get Cart Items
    getMyCarts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const cartItem = yield Cart_1.default.findAll({
                where: {
                    userId
                },
                include: [
                    {
                        model: Product_1.default,
                        attributes: ['id', 'productName', 'productDescription', 'productImageUrl'],
                        include: [
                            {
                                model: Category_1.default,
                                attributes: ['id', 'categoryName']
                            }
                        ]
                    }
                ],
                attributes: ['id', 'quantity']
            });
            if (cartItem.length === 0) {
                res.status(404).json({
                    message: "No items in the cart"
                });
            }
            else {
                res.status(200).json({
                    message: " Cart successfully retrieved",
                    data: cartItem
                });
            }
        });
    }
    // Delete cart item
    deleteCartItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { productId } = req.params;
            const product = yield Product_1.default.findByPk(productId);
            if (!product) {
                res.status(404).json({
                    message: `Product not found with this id:${productId} `
                });
                return;
            }
            yield Cart_1.default.destroy({
                where: {
                    userId,
                    productId,
                },
            });
            res.status(200).json({
                message: " Cart Items deleted successfully"
            });
        });
    }
    // Update  Cart Items
    updadteCartItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { productId } = req.params;
            const { quantity } = req.body;
            if (!quantity) {
                res.status(404).json({
                    message: "Please select a quantity"
                });
                return;
            }
            const cartData = yield Cart_1.default.findOne({
                where: {
                    userId,
                    productId
                },
                include: [
                    {
                        model: Product_1.default,
                        attributes: ['id', 'productName'],
                        include: [
                            {
                                model: Category_1.default,
                                attributes: ['id', 'categoryName']
                            }
                        ]
                    }
                ]
            });
            if (cartData) {
                cartData.quantity = quantity;
                yield (cartData === null || cartData === void 0 ? void 0 : cartData.save());
                res.status(200).json({
                    message: " Cart product updated successfully",
                    data: cartData
                });
            }
            else {
                res.status(404).json({
                    message: "Product does not exist with this id",
                });
            }
        });
    }
}
exports.default = new CartController();
