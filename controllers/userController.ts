import { Request, Response } from "express";
import { jwtAlgorithem, User, UserLogin } from "../dataTypes/user";
const userDao = require("../daos/userDao");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const { createJwtToken } = require("../middlewares/jwtAuthorization");

const signupUser = async (req: Request, res: Response) => {
  const userDetails: User = req.body;
  const duplicate = await userDao.findUserByEmail(userDetails.email);
  if (duplicate) {
    return res
      .status(409)
      .json({ message: `User email '${userDetails.email}' already existed!` });
  }
  const userId = uuid();
  const encriptPassword = await bcrypt.hash(userDetails.password, 10);
  const signupDetails: User = {
    ...userDetails,
    id: userId,
    password: encriptPassword,
  };
  userDao
    .createNewUser(signupDetails)
    .then((message: String) => {
      return res.status(201).json({ message: message });
    })
    .catch((error: Error) => {
      res.status(500).json({ message: "Internal server error !" });
    });
};

const loginUser = async (req: Request, res: Response) => {
  const loginDetails: UserLogin = req.body;
  if (!loginDetails.email || !loginDetails.password) {
    return res
      .status(400)
      .json({ message: `User email and password required !` });
  }
  const user = await userDao.findUserByEmail(loginDetails.email);
  if (!user) {
    return res
      .status(401)
      .json({ message: `User email '${loginDetails.email}' not existed!` });
  }
  const authorized = await bcrypt.compare(loginDetails.password, user.password);
  console.log(loginDetails);
  if (!authorized) {
    return res
      .status(401)
      .json({ message: `User email '${loginDetails.email}' not existed!` });
  }
  const tokenKey: jwtAlgorithem = {
    id: user.id,
    email: user.email,
  };
  const jwtToken = createJwtToken(tokenKey);
  userDao
    .createActiveUserSession(jwtToken)
    .then((message: String) => {
      return res.status(200).json({
        message: `Logged in successfully!`,
        token: jwtToken,
      });
    })
    .catch((error: Error) => {
      return res.status(500).json({
        message: `Internal Server Error!`,
      });
    });
};

const logoutUser = async (req: Request, res: Response) => {
  const token: string = req.body.token;
  userDao
    .deleteActiveSessionByToken(token)
    .then((message: String) => {
      return res.status(200).json({
        message: message,
      });
    })
    .catch((error: Error) => {
      return res.status(500).json({
        message: `Internal Server Error!`,
      });
    });
};

const getUserDetails = async (req: Request, res: Response) => {
  const ids: jwtAlgorithem = req.body;
  userDao.findUserByEmail(ids.email).then((user: User) => {
    return res.status(200).json({
      userDetails: user,
    });
  }).catch((erro: Error) => {
    return res.status(500).json({
      message: "Internal Server Error!",
    });
  })
  
};

module.exports = { signupUser, loginUser, logoutUser, getUserDetails };
