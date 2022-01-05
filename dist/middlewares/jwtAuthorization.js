"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("../config/routes");
require("dotenv");
const jwt = require("jsonwebtoken");
const { getActiveSessionByToken } = require("../daos/userDao");
const createJwtToken = (algorithm) => {
    return jwt.sign(algorithm, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
    });
};
const jwtAuthentication = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.sendStatus(401); // forbidden
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(403).json({ message: "Token Expired" }); // Unauthorized
            }
            else {
                return res.status(403).json({ message: "Token Malformed" }); // Unauthorized
            }
        }
        getActiveSessionByToken(token)
            .then((resp) => {
            if (resp) {
                if (req.url == routes_1.routes.logout) {
                    req.body = Object.assign(Object.assign({}, req.body), { token: token });
                }
                const authData = {
                    id: decoded.id,
                    email: decoded.email,
                };
                req.body = Object.assign(Object.assign({}, req.body), authData);
                next();
            }
            else {
                return res
                    .status(403)
                    .json({ message: "This session has been logged out!" }); // Unauthorized
            }
        })
            .catch((error) => {
            return res.status(500).json({ message: "Internal Server Error" });
        });
    });
};
module.exports = { createJwtToken, jwtAuthentication };
