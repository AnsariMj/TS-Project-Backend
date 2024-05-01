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
const axios_1 = __importDefault(require("axios"));
const Category_1 = __importDefault(require("../database/models/Category"));
const Order_1 = __importDefault(require("../database/models/Order"));
const OrderDetail_1 = __importDefault(require("../database/models/OrderDetail"));
const Payment_1 = __importDefault(require("../database/models/Payment"));
const Product_1 = __importDefault(require("../database/models/Product"));
const User_1 = __importDefault(require("../database/models/User"));
const orderTypes_1 = require("../types/orderTypes");
class OrderController {
    //Create a new order
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { phoneNumber, shippingAddress, totalAmount, paymentDetails, items } = req.body;
            if (!phoneNumber || !shippingAddress || !totalAmount || !paymentDetails || !paymentDetails.paymentMethod || items.length == 0) {
                res.status(400).json({
                    message: "Please provide valid Order Details"
                });
                return;
            }
            // Payment Table
            const paymentData = yield Payment_1.default.create({
                paymentMethod: paymentDetails.paymentMethod,
            });
            // Order Table
            const orderData = yield Order_1.default.create({
                phoneNumber,
                shippingAddress,
                totalAmount,
                userId,
                paymentId: paymentData.id
            });
            for (var i = 0; i < items.length; i++) {
                // OrderDetail Table
                yield OrderDetail_1.default.create({
                    quantity: items[i].quantity,
                    productId: items[i].productId,
                    orderId: orderData.id
                });
            }
            if (paymentDetails.paymentMethod === orderTypes_1.PaymentMethod.khalti) {
                //Khalti Integration
                const data = {
                    return_url: "http://localhost:5173/success",
                    purchase_order_id: orderData.id,
                    amount: totalAmount * 100,
                    website_url: "http://localhost:5173/",
                    purchase_order_name: 'orderName_' + orderData.id
                };
                const response = yield axios_1.default.post('https://a.khalti.com/api/v2/epayment/initiate/', data, {
                    headers: {
                        'Authorization': 'key eb0e734c13ce40e69ff06dfd7fc188da'
                    }
                });
                console.log(response);
                const khaltiResponse = response.data;
                paymentData.pidx = khaltiResponse.pidx;
                paymentData.save();
                res.status(200).json({
                    message: "Order Placed Successfully",
                    url: khaltiResponse.payment_url
                });
            }
            else {
                res.status(200).json({
                    message: "Order Placed Successfully",
                });
            }
        });
    }
    //Verfied order
    verifyTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pidx } = req.body;
            if (!pidx) {
                res.status(404).json({
                    message: "Please Provide a valid pidx"
                });
                return;
            }
            const response = yield axios_1.default.post("https://a.khalti.com/api/v2/epayment/lookup/", { pidx }, {
                headers: {
                    'Authorization': 'key eb0e734c13ce40e69ff06dfd7fc188da'
                }
            });
            const data = response.data;
            console.log(data);
            if (data.status === orderTypes_1.TransactionStatus.Completed) {
                yield Payment_1.default.update({ paymentStatus: 'paid' }, {
                    where: {
                        pidx: pidx
                    }
                });
                res.status(200).json({
                    message: 'Payment verified Successfully'
                });
            }
            else {
                res.status(200).json({
                    message: 'Payment not verified',
                });
            }
        });
    }
    //Fetch Order
    fetchMyOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const orders = yield Order_1.default.findAll({
                where: {
                    userId
                },
                include: [
                    {
                        model: Payment_1.default
                    }
                ]
            });
            if (orders.length > 0) {
                res.status(200).json({
                    message: 'Order Fetch Successfully',
                    data: orders
                });
            }
            else {
                res.status(404).json({
                    message: " NO order Found",
                    data: []
                });
            }
        });
    }
    //Fetch Order Details
    fetchMyOrderDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.id;
            const orderDetails = yield OrderDetail_1.default.findAll({
                where: {
                    orderId
                },
                include: [
                    {
                        model: Order_1.default,
                        attributes: ['id', 'phoneNumber', 'shippingAddress', 'totalAmount', 'orderStatus']
                    },
                    {
                        model: Product_1.default,
                        include: [
                            {
                                model: User_1.default,
                                attributes: ['id', 'username', 'email']
                            },
                            {
                                model: Category_1.default,
                                attributes: ['id', 'categoryName']
                            }
                        ],
                        attributes: ['id', 'productName', 'productDescription', 'productPrice', 'productTotalStockQty', 'productImageUrl']
                    },
                ],
                attributes: ['id', 'quantity']
            });
            if (orderDetails.length > 0) {
                res.status(200).json({
                    message: 'orderDetails Fetch Successfully',
                    data: orderDetails
                });
            }
            else {
                res.status(404).json({
                    message: " No orderDetails Found",
                    data: []
                });
            }
        });
    }
    // Cancel Orders
    cancellMyOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const orderId = req.params.id;
            const order = yield Order_1.default.findAll({
                where: {
                    userId,
                    id: orderId
                }
            });
            if ((order === null || order === void 0 ? void 0 : order.OrderStatus) === orderTypes_1.OrderStatus.OntheWay || (order === null || order === void 0 ? void 0 : order.OrderStatus) === orderTypes_1.OrderStatus.Prepration) {
                res.status(200).json({
                    message: "You cannot cancel this order because the order has already been placed"
                });
                return;
            }
            yield Order_1.default.update({ OrderStatus: orderTypes_1.OrderStatus.cancelled }, {
                where: {
                    id: orderId
                }
            });
            res.status(200).json({
                message: 'Order Cancelled Successfully'
            });
        });
    }
    //Change Order Status ( By Admin) 
    changeOrderStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.id;
            const orderStatus = req.body.orderStatus;
            yield Order_1.default.update({
                orderStatus: orderStatus
            }, {
                where: {
                    id: orderId
                }
            });
            if (!orderStatus) {
                res.status(400).json({
                    message: 'Please provide orderStatus'
                });
                return;
            }
            res.status(200).json({
                message: 'Order status updated successfully'
            });
        });
    }
    //Change Payment Status ( By Admin) 
    changePaymentStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.id;
            const paymentStatus = req.body.paymentStatus;
            //find order of given id and update payment status in payment table
            const order = yield Order_1.default.findByPk(orderId);
            // added new column in order table
            const extendedOrder = order;
            yield Payment_1.default.update({
                paymentStatus: paymentStatus
            }, {
                where: {
                    id: extendedOrder.paymentId
                }
            });
            res.status(200).json({
                message: `payment status of orderId '${orderId}' updated successfully to '${paymentStatus}'`,
            });
        });
    }
    //Delete Order ( By Admin) 
    deleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.id;
            //find order of given id and update payment status in payment table
            const order = yield Order_1.default.findByPk(orderId);
            // added new column in order table
            const extendedOrder = order;
            if (order) {
                yield OrderDetail_1.default.destroy({
                    where: {
                        orderId: orderId
                    }
                });
                yield Payment_1.default.destroy({
                    where: {
                        id: extendedOrder.paymentId
                    }
                });
                yield Order_1.default.destroy({
                    where: {
                        id: orderId
                    }
                });
                res.status(200).json({
                    message: "Order deleted successfully"
                });
            }
            else {
                res.status(404).json({
                    message: "No Order Details found for this order details"
                });
            }
        });
    }
}
exports.default = new OrderController();
