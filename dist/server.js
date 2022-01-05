"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./config/routes");
const PORT = process.env.PORT || 8080;
require("dotenv").config();
const path = require("path");
const { reqLogger } = require("./middlewares/logging");
const app = (0, express_1.default)();
app.use(reqLogger);
//Built-in middleware to handle urlencoded data or form data
app.use(express_1.default.urlencoded({ extended: false }));
// Built-in middleware to handle json data
app.use(express_1.default.json());
app.use(routes_1.routes.user, require("./routers/userRouter"));
app.get("/", (req, res) => {
    console.log("Get Request comming");
    res.status(200).json({ message: "request recieved" });
});
app.listen(PORT, () => console.log("runnign on port 8080"));
