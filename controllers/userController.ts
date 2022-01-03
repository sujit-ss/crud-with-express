import { Request, Response } from "express";
import { User } from "../dataTypes/user";
const userDao = require("../daos/userDao")
const signupUser = (req: Request, res: Response) => {
  const userDetails: User = req.body;
  userDao.createNewUser(userDetails);
  return res.status(200).json({ message: "request recieved" });
};
module.exports = { signupUser };
