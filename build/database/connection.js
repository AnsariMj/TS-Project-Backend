"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_typescript_1 = require("sequelize-typescript");
const Cart_1 = __importDefault(require("./models/Cart"));
const Category_1 = __importDefault(require("./models/Category"));
const Order_1 = __importDefault(require("./models/Order"));
const OrderDetail_1 = __importDefault(require("./models/OrderDetail"));
const Payment_1 = __importDefault(require("./models/Payment"));
const Product_1 = __importDefault(require("./models/Product"));
const User_1 = __importDefault(require("./models/User"));
// import Category from './models/Category';
// import Product from './models/Product';
// import User from './models/User';
dotenv_1.default.config();
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME,
    dialect: 'mysql',
    username: process.env.DB_USERNAME,
    password: process.env.PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    models: [__dirname + "/models"],
    // logging: false  //disables the console logging
    // logging: (msg) => console.log(msg),   // used for debugging purposes it shows in console log
});
/* authenticating the connection to the database using Sequelize. */
sequelize.authenticate()
    .then(() => { console.log("connected to database"); })
    .catch((err) => { err.message; });
// make "true" when new model fiels in added in the model
sequelize.sync({ force: false })
    // sequelize.sync({ force: true })
    .then(() => { console.log("Synced with database !!!"); });
// Relationship
//user-product relation
User_1.default.hasMany(Product_1.default, { foreignKey: 'userId' });
Product_1.default.belongsTo(User_1.default, { foreignKey: 'userId' });
// user-cart relation 
User_1.default.hasMany(Cart_1.default, { foreignKey: 'userId' });
Cart_1.default.belongsTo(User_1.default, { foreignKey: 'userId' });
//category-Product relation
Category_1.default.hasOne(Product_1.default, { foreignKey: "categoryId" });
Product_1.default.belongsTo(Category_1.default, { foreignKey: "categoryId" });
// product-cart relation 
Product_1.default.hasMany(Cart_1.default, { foreignKey: 'productId' });
Cart_1.default.belongsTo(Product_1.default, { foreignKey: 'productId' });
//ordersDetails order payment and User Relationship
// Order - orderDetail Relation
Order_1.default.hasMany(OrderDetail_1.default, { foreignKey: 'orderId' });
OrderDetail_1.default.belongsTo(Order_1.default, { foreignKey: 'orderId' });
// Product - orderDetail Relation
Product_1.default.hasMany(OrderDetail_1.default, { foreignKey: "productId" });
OrderDetail_1.default.belongsTo(Product_1.default, { foreignKey: 'productId' });
// Payment - Order Relation
Payment_1.default.hasOne(Order_1.default, { foreignKey: 'paymentId' });
Order_1.default.belongsTo(Payment_1.default, { foreignKey: 'paymentId' });
// User - Order Relation
User_1.default.hasMany(Order_1.default, { foreignKey: 'userId' });
Order_1.default.belongsTo(User_1.default, { foreignKey: 'userId' });
exports.default = sequelize;
