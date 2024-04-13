import { Request, Response } from "express";
import Category from "../database/models/Category";

class CategoryController {
    categoryData = [
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


    ]

    async seedCategory(): Promise<void> {

        const datas = await Category.findAll()
        if (datas.length === 0) {
            const data = await Category.bulkCreate(this.categoryData)
            console.log("Category seeded successfully")
        } else {
            console.log("Catefories already seeded")
        }
    }

    // Add Category
    async addCategory(req: Request, res: Response): Promise<void> {
        const { categoryName } = req.body
        if (!categoryName) {
            res.status(404).json({
                message: "Please Provide a Category Name",
            })
            return

        }
        await Category.create({
            categoryName
        })
        res.status(200).json({
            message: " Category created successfully"
        })
    }

    //Get category
    async getCategory(req: Request, res: Response): Promise<void> {
        const data = await Category.findAll()
        res.status(200).json({
            message: "Category Fetched successfully",
            data
        })
    }

    //Delete Category
    async deleteCategory(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const data = await Category.findAll({
            where: {
                id: id
            }
        })
        if (data.length === 0) {
            res.status(404).json({
                message: "No category found "
            })
        } else {
            await Category.destroy({
                where: {
                    id: id
                }
            })
            res.status(200).json({
                message: " Category Deleted successfully"
            })
        }
    }

    // Update category
    async updateCategory(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { categoryName } = req.body;
        await Category.update({ categoryName }, {
            where: {
                id: id
            }
        })
        res.status(200).json({
            message: " Category Updated successfully"
        })
    }
}
export default new CategoryController()