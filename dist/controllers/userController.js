"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userDao = require("../daos/userDao");
const signupUser = (req, res) => {
    const userDetails = req.body;
    userDao.createNewUser(userDetails);
    return res.status(200).json({ message: "request recieved" });
};
module.exports = { signupUser };
