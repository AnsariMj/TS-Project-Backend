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

/* This code snippet is authenticating the connection to the database using Sequelize. */
sequelize.authenticate()
    .then(() => { console.log("connected to database") })
    .catch((err) => { err.message })


sequelize.sync({ force: false })    // make "true" when new model fiels in added in the model
    .then(() => { console.log("Synced with database !!!") })

export default sequelize