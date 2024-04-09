import dotenv from 'dotenv';
import { Sequelize } from "sequelize-typescript";
// import Category from './models/Category';
// import Product from './models/Product';
// import User from './models/User';
dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME ,
    dialect: 'mysql',
    username: process.env.DB_USERNAME,
    password: process.env.PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    models: [__dirname + "/models"]
});

/* This code snippet is authenticating the connection to the database using Sequelize. */
sequelize.authenticate()
    .then(() => { console.log("connected to database") })
    .catch((err) => { err.message })


sequelize.sync({ force: false })    // make "true" when new model fiels in added in the model
    .then(() => { console.log("Synced with database !!!") })


// Relationship
// User.hasMany(Product, { foreignKey: 'userId' })
// Product.belongsTo(User, { foreignKey: 'userId' })


// Product.belongsTo(Category, { foreignKey: 'categoryId' })
// Category.hasOne(Product, { foreignKey: "categoryId" })







export default sequelize