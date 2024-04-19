import axios from "axios";
import { Response } from "express";
import Order from "../database/models/Order";
import orderDetail from "../database/models/OrderDetail";
import Payment from "../database/models/Payment";
import Product from "../database/models/Product";
import { AuthRequest } from "../middleware/authMiddleware";
import { OrderData, OrderStatus, PaymentMethod, TransactionStatus, TransactionVerificationResponse, khaltiResponse } from "../types/orderTypes";

class OrderController {
    //Create a new order
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

    //Verfied order
    async verifyTransaction(req: AuthRequest, res: Response): Promise<void> {
        const { pidx } = req.body;
        if (!pidx) {
            res.status(404).json({
                message: "Please Provide a valid pidx"
            });
            return
        }
        const response = await axios.post("https://a.khalti.com/api/v2/epayment/lookup/",
            { pidx },
            {
                headers: {
                    'Authorization': 'key eb0e734c13ce40e69ff06dfd7fc188da'
                }
            }
        )
        const data: TransactionVerificationResponse = response.data
        console.log(data)
        if (data.status === TransactionStatus.Completed) {
            await Payment.update({ paymentStatus: 'paid' }, {
                where: {
                    pidx: pidx
                }

            })
            res.status(200).json({
                message: 'Payment verified Successfully'
            })
        } else {
            res.status(200).json({
                message: 'Payment not verified',
            })
        }
    }

    //Fetch Order
    async fetchMyOrders(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?.id;
        const orders = await Order.findAll({
            where: {
                userId
            },
            include: [
                {
                    model: Payment
                }
            ]
        })
        if (orders.length > 0) {
            res.status(200).json({
                message: 'Order Fetch Successfully',
                data: orders
            })
        } else {
            res.status(404).json({
                message: " NO order Found",
                data: []
            })
        }
    }

    //Fetch Order Details
    async fetchMyOrderDetails(req: AuthRequest, res: Response): Promise<void> {
        const orderId = req.params.id;
        const orderDetails = await orderDetail.findAll({
            where: {
                orderId
            },
            include: [
                {
                    model: Product
                }
            ]
        })
        if (orderDetails.length > 0) {
            res.status(200).json({
                message: 'orderDetails Fetch Successfully',
                data: orderDetails
            })
        } else {
            res.status(404).json({
                message: " No orderDetails Found",
                data: []
            })
        }
    }

    // Cancel Orders
    async cancellMyOrder(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?.id;
        const orderId = req.params.id
        const order: any = await Order.findAll({
            where: {
                userId,
                id: orderId
            }
        })
        if (order?.OrderStatus === OrderStatus.OntheWay || order?.OrderStatus === OrderStatus.Prepration) {
            res.status(200).json({
                message: "You cannot cancel this order because the order has already been placed"
            })
            return
        }
        await Order.update({ OrderStatus: OrderStatus.cancelled }, {
            where: {
                id: orderId
            }
        })
        res.status(200).json({
            message: 'Order Cancelled Successfully'
        })
    }

}
export default new OrderController();