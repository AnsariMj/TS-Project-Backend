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
const Category_1 = __importDefault(require("../database/models/Category"));
const Product_1 = __importDefault(require("../database/models/Product"));
const User_1 = __importDefault(require("../database/models/User"));
class ProductController {
    //Add Product
    addProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            console.log("User id is", userId);
            const { productName, productDescription, productTotalStockQty, productPrice, categoryId } = req.body;
            let fileName;
            if (req.file) {
                fileName = (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename;
            }
            else {
                fileName = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lfGVufDB8fDB8fHww";
            }
            if (!productName || !productDescription || !productTotalStockQty || !productPrice || !categoryId) {
                res.status(400).json({
                    message: " Please Provide the correc Crdentials"
                });
                return;
            }
            // To check whether product is already exists or not
            // const [data] = await Product.findAll({
            // })
            // if (data) {
            //     res.status(404).json({
            //         message: "Product  Already Exists"
            //     })
            //     return;
            // }
            yield Product_1.default.create({
                productName,
                productDescription,
                productPrice,
                productTotalStockQty,
                productImageUrl: fileName,
                userId: userId,
                categoryId: categoryId
            });
            res.status(200).json({
                message: " Product added successfully"
            });
        });
    }
    //Get All Product 
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield Product_1.default.findAll({
                include: [
                    {
                        model: User_1.default,
                        attributes: ['id', 'username', 'email']
                    },
                    {
                        model: Category_1.default,
                        attributes: ['id', 'categoryName']
                    }
                ]
            });
            res.status(200).json({
                message: "Product fetch successfully",
                data
            });
        });
    }
    // Get Single Product
    getSingelProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = yield Product_1.default.findAll({
                where: {
                    id: id
                },
                include: [
                    {
                        model: User_1.default,
                        attributes: ['id', 'email', 'username']
                    },
                    {
                        model: Category_1.default,
                        attributes: ['id', 'categoryName']
                    }
                ]
            });
            if (data.length === 0) {
                res.status(404).json({
                    message: "No products with that is id"
                });
            }
            else {
                res.status(200).json({
                    message: "Product fetch successfully",
                    data
                });
            }
        });
    }
    //Delete products
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = yield Product_1.default.findAll({
                where: {
                    id: id
                }
            });
            if (data.length > 0) {
                yield Product_1.default.destroy({
                    where: {
                        id: id
                    }
                });
                res.status(200).json({
                    message: "Product deleted successfully"
                });
            }
            else {
                res.status(404).json({
                    message: "No Product found with this id "
                });
            }
        });
    }
}
exports.default = new ProductController();
