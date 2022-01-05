import { Request, Response, NextFunction } from "express";
import { routes } from "../config/routes";
import { jwtAlgorithem } from "../dataTypes/user";
require("dotenv");
const jwt = require("jsonwebtoken");
const { getActiveSessionByToken } = require("../daos/userDao");

const createJwtToken = (algorithm: jwtAlgorithem) => {
  return jwt.sign(algorithm, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const jwtAuthentication = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.sendStatus(401); // forbidden
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (error: Error, decoded: jwtAlgorithem) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          return res.status(403).json({ message: "Token Expired" }); // Unauthorized
        } else {
          return res.status(403).json({ message: "Token Malformed" }); // Unauthorized
        }
      }
      getActiveSessionByToken(token)
        .then((resp: boolean) => {
          if (resp) {
            if (req.url == routes.logout) {
              req.body = { ...req.body, token: token };
            }
            const authData: jwtAlgorithem = {
              id: decoded.id,
              email: decoded.email,
            };
            req.body = { ...req.body, ...authData };
            next();
          } else {
            return res
              .status(403)
              .json({ message: "This session has been logged out!" }); // Unauthorized
          }
        })
        .catch((error: Error) => {
          return res.status(500).json({ message: "Internal Server Error" });
        });
    }
  );
};

module.exports = { createJwtToken, jwtAuthentication };
