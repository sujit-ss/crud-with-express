"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connectionPool = require("../config/dbConfig");
const { SQL_QUERY } = require("../config/sqlQuery");
const createNewUser = (user) => {
    return new Promise((resolve, reject) => {
        connectionPool.query(SQL_QUERY.createNewUser, [
            user.id,
            user.name,
            user.gender,
            user.age,
            user.email,
            user.contact,
            user.password,
        ], (queryError, result) => {
            if (queryError) {
                reject(queryError);
            }
            resolve(`Registration successfull !`);
        });
    });
};
const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        connectionPool.query(SQL_QUERY.fetchUserByEmail, email, (queryErro, result) => {
            if (queryErro) {
                reject(queryErro);
            }
            if (result.length > 0) {
                resolve(result[0]);
            }
            else {
                resolve(null);
            }
        });
    });
};
const createActiveUserSession = (token) => {
    return new Promise((resolve, reject) => {
        connectionPool.query(SQL_QUERY.createActiveUserSession, token, (queryErro, result) => {
            if (queryErro) {
                reject(queryErro);
            }
            resolve("New session created");
        });
    });
};
const getActiveSessionByToken = (token) => {
    return new Promise((resolve, reject) => {
        connectionPool.query(SQL_QUERY.fetchActiveUserSession, token, (queryErro, result) => {
            if (queryErro) {
                reject(queryErro);
            }
            if (result.length > 0) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    });
};
const deleteActiveSessionByToken = (token) => {
    return new Promise((resolve, reject) => {
        connectionPool.query(SQL_QUERY.deleteActiveUserSession, token, (queryErro, result) => {
            if (queryErro) {
                console.log(queryErro);
                reject(queryErro);
            }
            resolve("Logged out successfully!");
        });
    });
};
module.exports = {
    findUserByEmail,
    createNewUser,
    createActiveUserSession,
    getActiveSessionByToken,
    deleteActiveSessionByToken,
};
