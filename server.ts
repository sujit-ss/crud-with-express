import express, { Request, Response, Application } from "express";

const PORT = process.env.PORT || 8080;
require("dotenv").config();
const path = require("path");
const { reqLogger } = require("./middlewares/logging");
const { routes } = require("./config/routes");
const app: Application = express();

app.use(reqLogger);

//Built-in middleware to handle urlencoded data or form data
app.use(express.urlencoded({ extended: false }));

// Built-in middleware to handle json data
app.use(express.json());

app.use(routes.user, require("./routers/userRouter"));

app.get("/", (req: Request, res: Response) => {
  console.log("Get Request comming");
  res.status(200).json({ message: "request recieved" });
});

app.listen(PORT, () => console.log("runnign on port 8080"));
