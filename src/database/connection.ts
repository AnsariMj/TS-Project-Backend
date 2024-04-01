import dotenv from 'dotenv';
import { Sequelize } from "sequelize-typescript";
dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: 'mysql',
    username: process.env.DB_USERNAME,
    password: process.env.PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    models: [__dirname + "/models"]
});

sequelize.authenticate()
    .then(() => { console.log("connected") })
    .catch((err) => { err.message })


sequelize.sync({ force: false })
    .then(() => { console.log("Synced !!!") })

export default sequelize