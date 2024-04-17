import { Response } from "express";
import Cart from "../database/models/Cart";
import Category from "../database/models/Category";
import Product from "../database/models/Product";
import { AuthRequest } from "../middleware/authMiddleware";

class CartController {
    //Add to cart

    async addToCart(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?.id;
        const { quantity, productId } = req.body;
        if (!quantity) {
            res.status(404).json({
                messagea: " Please Provide Quantity and user ID"
            });
        }
        let cartItem = await Cart.findOne({
            where: {
                productId,
                userId
            }
        })
        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            //insert items to the cart (creating cart for specific product)
            cartItem = await Cart.create({
                userId,
                productId,
                quantity,
            })
        }
        res.status(200).json({
            message: "Produt added to cart",
            data: cartItem
        })
    }

    //Get Cart Items
    async getMyCarts(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?.id;
        const cartItem = await Cart.findAll({
            where: {
                userId
            },
            include: [
                {
                    model: Product,
                    attributes: ['id', 'productName','productDescription','productImageUrl'],
                    include: [
                        {
                            model: Category,
                            attributes: ['id', 'categoryName']
                        }
                    ]
                }
            ],
            attributes: ['id', 'quantity']
        })
        if (cartItem.length === 0) {
            res.status(404).json({
                message: "No items in the cart"
            })
        } else {
            res.status(200).json({
                message: " Cart successfully retrieved",
                data: cartItem
            })
        }

    }

    // Delete cart item
    async deleteCartItem(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?.id;
        const { productId } = req.params;
        const product = await Product.findByPk(productId)
        if (!product) {
            res.status(404).json({
                message: `Product not found with this id:${productId} `
            })
            return
        }
        await Cart.destroy({
            where: {
                userId,
                productId,
            },
        })
        res.status(200).json({
            message: " Cart Items deleted successfully"
        })
    }
    // Update  Cart Items
    async updadteCartItem(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        const { productId } = req.params;
        const { quantity } = req.body;
        if (!quantity) {
            res.status(404).json({
                message: "Please select a quantity"
            })
            return
        }
        const cartData = await Cart.findOne({
            where: {
                userId,
                productId
            },
            include: [
                {
                    model: Product,
                    attributes: ['id', 'productName'],
                    include: [
                        {
                            model: Category,
                            attributes: ['id', 'categoryName']
                        }
                    ]
                }
            ]
        })
        if (cartData) {
            cartData.quantity = quantity
            await cartData?.save()
            res.status(200).json({
                message: " Cart product updated successfully",
                data: cartData
            })
        } else {
            res.status(404).json({
                message: "Product does not exist with this id",
            })
        }
    }


}


export default new CartController();