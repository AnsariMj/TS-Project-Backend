import axios from "axios";
import { Response } from "express";
import Order from "../database/models/Order";
import orderDetail from "../database/models/OrderDetail";
import Payment from "../database/models/Payment";
import { AuthRequest } from "../middleware/authMiddleware";
import { OrderData, PaymentMethod, khaltiResponse } from "../types/orderTypes";

class OrderController {
    async createOrder(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?.id;
        const { phoneNumber, shippingAddress, totalAmount, paymentDetails, items }: OrderData = req.body;
        if (!phoneNumber || !shippingAddress || !totalAmount || !paymentDetails || !paymentDetails.paymentMethod || items.length == 0) {
            res.status(400).json({
                message: "Please provide valid Order Details"
            })
            return
        }
        // Payment Table
        const paymentData = await Payment.create({
            paymentMethod: paymentDetails.paymentMethod,
        })

        // Order Table
        const orderData = await Order.create({
            phoneNumber,
            shippingAddress,
            totalAmount,
            userId,
            paymentId: paymentData.id
        })
        for (var i = 0; i < items.length; i++) {
            // OrderDetail Table
            await orderDetail.create({
                quantity: items[i].quantity,
                productId: items[i].productId,
                orderId: orderData.id
            })
        }
        if (paymentDetails.paymentMethod === PaymentMethod.khalti) {
            //Khalti Integration
            const data = {
                return_url: "http://localhost:5173/success",
                purchase_order_id: orderData.id,
                amount: totalAmount * 100,
                website_url: "http://localhost:5173/",
                purchase_order_name: 'orderName_' + orderData.id
            }

            const response = await axios.post('https://a.khalti.com/api/v2/epayment/initiate/',
                data, {
                headers: {
                    'Authorization': 'key eb0e734c13ce40e69ff06dfd7fc188da'
                }
            })
            console.log(response)

            const khaltiResponse: khaltiResponse = response.data
            paymentData.pidx = khaltiResponse.pidx
            paymentData.save()
            res.status(200).json({
                message: "Order Placed Successfully",
                url: khaltiResponse.payment_url
            })
        }
        else {
            res.status(200).json({
                message: "Order Placed Successfully",
            })
        }
    }

}
export default new OrderController();