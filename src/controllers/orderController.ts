import { Response } from "express";
import Order from "../database/models/Order";
import orderDetail from "../database/models/OrderDetail";
import Payment from "../database/models/Payment";
import { AuthRequest } from "../middleware/authMiddleware";
import { OrderData, PaymentMethod } from "../types/orderTypes";

const items = [
    {
        quantity: 2,
        productId: 2
    },
    {
        quantity: 2,
        productId: 2
    },
    {
        quantity: 2,
        productId: 2
    },

]

class OrderController {
    async createOrder(req: AuthRequest, res: Response): Promise<void> {
        const usreId = req.user?.id;
        const { phoneNumber, shippingAddress, totalAmount, paymentDetails, items }: OrderData = req.body;
        if (!phoneNumber || !shippingAddress || !totalAmount || !paymentDetails || !paymentDetails.paymentMethod || items.length == 0) {
            res.status(400).json({
                message: "Please provide valid Order Details"
            })
            return
        }
        const orderData = await Order.create({
            phoneNumber,
            shippingAddress,
            totalAmount,
            usreId
        })
        await Payment.create({
            paymentMethod: paymentDetails.paymentMethod,
        })
        for (var i = 0; i < items.length; i++) {
            await orderDetail.create({
                quantity: items[i].quantity,
                productId: items[0].productId,
                orderId: orderData.id
            })
        }
        if (paymentDetails.paymentMethod === PaymentMethod.khalti) {
            //Khalti Integration
        }
        else {
            res.status(200).json({
                message: "Order Placed Successfully",
            })
        }
    }

}
export default new OrderController();