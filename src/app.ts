import express, { Application, Request, Response } from 'express';

const app: Application = express();
const PORT: number = 5000;


require('./model/index')
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the app!");
})

app.get("/about", (req: Request, res: Response) => {
    res.send("Welcome to the  About Page!");
});

app.get("/contact", (req: Request, res: Response) => {
    res.send("Welcome to the  Contact Page!");
});
app.get("/me", (req: Request, res: Response) => {
    res.send("Welcome!!");
});

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
})