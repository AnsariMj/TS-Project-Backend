"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendOrder = exports.OrderStatus = exports.TransactionStatus = exports.Paymentstatus = exports.PaymentMethod = void 0;
const Order_1 = __importDefault(require("../database/models/Order"));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["Cod"] = "cod";
    PaymentMethod["khalti"] = "khalti";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var Paymentstatus;
(function (Paymentstatus) {
    Paymentstatus["Paid"] = "paid";
    Paymentstatus["Unpaid"] = "unpaid";
})(Paymentstatus || (exports.Paymentstatus = Paymentstatus = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["Completed"] = "Completed";
    TransactionStatus["Refunded"] = "Refunded";
    TransactionStatus["Pending"] = "Pending";
    TransactionStatus["Initiated"] = "Initiated";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Pending"] = "pending";
    OrderStatus["cancelled"] = "cancelled";
    OrderStatus["OntheWay"] = "ontheway";
    OrderStatus["Delivered"] = "delivered";
    OrderStatus["Prepration"] = "prepration";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
// to add a new column in Order Table to update paymentId
class ExtendOrder extends Order_1.default {
}
exports.ExtendOrder = ExtendOrder;
