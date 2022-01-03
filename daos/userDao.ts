import { User } from "../dataTypes/user";
const connectionPool = require("../config/dbConfig");

const createNewUser = (user: User) => {
    console.log(user)
};

module.exports = {createNewUser}