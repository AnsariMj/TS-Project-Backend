import { Request, Response } from "express";
import Category from "../database/models/Category";
import Product from "../database/models/Product";
import User from "../database/models/User";
import { AuthRequest } from "../middleware/authMiddleware";

class ProductController {
    //Add Product
    async addProduct(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?.id;
        console.log("User id is", userId);
        const { productName, productDescription, productTotalStockQty, productPrice, categoryId } = req.body;
        let fileName
        if (req.file) {
            fileName = req.file?.filename;
        } else {
            fileName = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lfGVufDB8fDB8fHww"
        }
        if (!productName || !productDescription || !productTotalStockQty || !productPrice || !categoryId) {
            res.status(400).json({
                message: " Please Provide the correc Crdentials"
            })
            return
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
        await Product.create({
            productName,
            productDescription,
            productPrice,
            productTotalStockQty,
            productImageUrl: fileName,
            userId: userId,
            categoryId: categoryId
        })
        res.status(200).json({
            message: " Product added successfully"
        })
    }

    //Get All Product 
    async getAllProducts(req: Request, res: Response): Promise<void> {
        const data = await Product.findAll(
            {
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username', 'email']
                    },
                    {
                        model: Category,
                        attributes: ['id', 'categoryName']
                    }
                ]
            })
        res.status(200).json({
            message: "Product fetch successfully",
            data
        })

    }

    // Get Single Product
    async getSingelProduct(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const data = await Product.findAll({
            where: {
                id: id
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'email', 'username']
                },
                {
                    model: Category,
                    attributes: ['id', 'categoryName']
                }
            ]
        })
        if (data.length === 0) {
            res.status(404).json({
                message: "No products with that is id"
            })
        } else {
            res.status(200).json({
                message: "Product fetch successfully",
                data
            })
        }

    }

    //Delete products
    async deleteProduct(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const data = await Product.findAll({
            where: {
                id: id
            }
        })
        if (data.length > 0) {
            await Product.destroy({
                where: {
                    id: id
                }
            })
            res.status(200).json({
                message: "Product deleted successfully"
            })
        } else {
            res.status(404).json({
                message: "No Product found with this id "
            })
        }
    }

}

export default new ProductController()