import * as dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import './database/connection';
const app: Application = express();
const PORT: number = 5000;
dotenv.config();


app.use(express.json());



import adminSeeder from './adminSeeder';
import productRoute from './routes/productRoute';
import userRoute from './routes/userRoute';

app.use("", userRoute)
app.use("/admin/product", productRoute)


//Admin Seeder
adminSeeder()
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to server Page!");
})


app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
})