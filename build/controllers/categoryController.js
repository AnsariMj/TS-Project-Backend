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
class CategoryController {
    constructor() {
        this.categoryData = [
            {
                categoryName: "Electronics"
            },
            {
                categoryName: "Groceries"
            },
            {
                categoryName: "Food/Beverages"
            },
            {
                categoryName: "Fashion"
            },
        ];
    }
    seedCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const datas = yield Category_1.default.findAll();
            if (datas.length === 0) {
                const data = yield Category_1.default.bulkCreate(this.categoryData);
                console.log("Category seeded successfully");
            }
            else {
                console.log("Categories already seeded");
            }
        });
    }
    // Add Category
    addCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoryName } = req.body;
            if (!categoryName) {
                res.status(404).json({
                    message: "Please Provide a Category Name",
                });
                return;
            }
            yield Category_1.default.create({
                categoryName
            });
            res.status(200).json({
                message: " Category created successfully"
            });
        });
    }
    //Get category
    getCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield Category_1.default.findAll();
            res.status(200).json({
                message: "Category Fetched successfully",
                data
            });
        });
    }
    //Delete Category
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield Category_1.default.findAll({
                where: {
                    id: id
                }
            });
            if (data.length === 0) {
                res.status(404).json({
                    message: "No category found "
                });
            }
            else {
                yield Category_1.default.destroy({
                    where: {
                        id: id
                    }
                });
                res.status(200).json({
                    message: " Category Deleted successfully"
                });
            }
        });
    }
    // Update category
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { categoryName } = req.body;
            yield Category_1.default.update({ categoryName }, {
                where: {
                    id: id
                }
            });
            res.status(200).json({
                message: " Category Updated successfully"
            });
        });
    }
}
exports.default = new CategoryController();
