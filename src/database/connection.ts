import dotenv from 'dotenv';
import { Sequelize } from "sequelize-typescript";
import Cart from './models/Cart';
import Category from './models/Category';
import Order from './models/Order';
import orderDetail from './models/OrderDetail';
import Payment from './models/Payment';
import Product from './models/Product';
import User from './models/User';
// import Category from './models/Category';
// import Product from './models/Product';
// import User from './models/User';
dotenv.config();

const sequelize = new Sequelize({
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
    .then(() => { console.log("connected to database") })
    .catch((err) => { err.message })

// make "true" when new model fiels in added in the model
sequelize.sync({ force: false })
    // sequelize.sync({ force: true })
    .then(() => { console.log("Synced with database !!!") })







// Relationship
//user-product relation
User.hasMany(Product, { foreignKey: 'userId' })
Product.belongsTo(User, { foreignKey: 'userId' })

// user-cart relation 
User.hasMany(Cart, { foreignKey: 'userId' })
Cart.belongsTo(User, { foreignKey: 'userId' })



//category-Product relation
Category.hasOne(Product, { foreignKey: "categoryId" })
Product.belongsTo(Category, { foreignKey: "categoryId" })


// product-cart relation 
Product.hasMany(Cart, { foreignKey: 'productId' })
Cart.belongsTo(Product, { foreignKey: 'productId' })



//ordersDetails order payment and User Relationship

// Order - orderDetail Relation
Order.hasMany(orderDetail, { foreignKey: 'orderId' })
orderDetail.belongsTo(Order, { foreignKey: 'orderId' })

// Product - orderDetail Relation
Product.hasMany(orderDetail, { foreignKey: "productId" })
orderDetail.belongsTo(Product, { foreignKey: 'productId' })

// Payment - Order Relation
Payment.hasOne(Order, { foreignKey: 'paymentId' })
Order.belongsTo(Payment, { foreignKey: 'paymentId' })

// User - Order Relation
User.hasMany(Order, { foreignKey: 'userId' })
Order.belongsTo(User, { foreignKey: 'userId' })

export default sequelize