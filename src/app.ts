import * as dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import './database/connection';
const app: Application = express();
const PORT: number = 5001 || 5000;
dotenv.config();


app.use(express.json());



import adminSeeder from './adminSeeder';
import categoryController from './controllers/categoryController';
import cartRoute from './routes/cartRoute';
import categoryRoute from './routes/categoryRoute';
import productRoute from './routes/productRoute';
import userRoute from './routes/userRoute';

app.use("", userRoute)
app.use("/admin/product", productRoute)
app.use("/admin/category", categoryRoute)
app.use('/customer/cart', cartRoute)


//Admin Seeder
adminSeeder()
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to server Page!");
})


app.listen(PORT, () => {
    categoryController.seedCategory()
    console.log("Listening on port " + PORT);
})