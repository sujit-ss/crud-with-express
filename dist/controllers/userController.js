"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const userDao = require("../daos/userDao");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const { createJwtToken } = require("../middlewares/jwtAuthorization");
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userDetails = req.body;
    const duplicate = yield userDao.findUserByEmail(userDetails.email);
    if (duplicate) {
        return res
            .status(409)
            .json({ message: `User email '${userDetails.email}' already existed!` });
    }
    const userId = uuid();
    const encriptPassword = yield bcrypt.hash(userDetails.password, 10);
    const signupDetails = Object.assign(Object.assign({}, userDetails), { id: userId, password: encriptPassword });
    userDao
        .createNewUser(signupDetails)
        .then((message) => {
        return res.status(201).json({ message: message });
    })
        .catch((error) => {
        res.status(500).json({ message: "Internal server error !" });
    });
});
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginDetails = req.body;
    if (!loginDetails.email || !loginDetails.password) {
        return res
            .status(400)
            .json({ message: `User email and password required !` });
    }
    const user = yield userDao.findUserByEmail(loginDetails.email);
    if (!user) {
        return res
            .status(401)
            .json({ message: `User email '${loginDetails.email}' not existed!` });
    }
    const authorized = yield bcrypt.compare(loginDetails.password, user.password);
    console.log(loginDetails);
    if (!authorized) {
        return res
            .status(401)
            .json({ message: `User email '${loginDetails.email}' not existed!` });
    }
    const tokenKey = {
        id: user.id,
        email: user.email,
    };
    const jwtToken = createJwtToken(tokenKey);
    userDao
        .createActiveUserSession(jwtToken)
        .then((message) => {
        return res.status(200).json({
            message: `Logged in successfully!`,
            token: jwtToken,
        });
    })
        .catch((error) => {
        return res.status(500).json({
            message: `Internal Server Error!`,
        });
    });
});
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    userDao
        .deleteActiveSessionByToken(token)
        .then((message) => {
        return res.status(200).json({
            message: message,
        });
    })
        .catch((error) => {
        return res.status(500).json({
            message: `Internal Server Error!`,
        });
    });
});
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = req.body;
    userDao.findUserByEmail(ids.email).then((user) => {
        return res.status(200).json({
            userDetails: user,
        });
    }).catch((erro) => {
        return res.status(500).json({
            message: "Internal Server Error!",
        });
    });
});
module.exports = { signupUser, loginUser, logoutUser, getUserDetails };
