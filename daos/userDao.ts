import { User } from "../dataTypes/user";
const connectionPool = require("../config/dbConfig");
const { SQL_QUERY } = require("../config/sqlQuery");

const createNewUser = (user: User) => {
  return new Promise((resolve, reject) => {
    connectionPool.query(
      SQL_QUERY.createNewUser,
      [
        user.id,
        user.name,
        user.gender,
        user.age,
        user.email,
        user.contact,
        user.password,
      ],
      (queryError: Error, result: Object) => {
        if (queryError) {
          reject(queryError);
        }
        resolve(`Registration successfull !`);
      }
    );
  });
};

const findUserByEmail = (email: String) => {
  return new Promise((resolve, reject) => {
    connectionPool.query(
      SQL_QUERY.fetchUserByEmail,
      email,
      (queryErro: Error, result: User[]) => {
        if (queryErro) {
          reject(queryErro);
        }
        if (result.length > 0) {
          resolve(result[0]);
        } else {
          resolve(null);
        }
      }
    );
  });
};

const createActiveUserSession = (token: Object) => {
  return new Promise((resolve, reject) => {
    connectionPool.query(
      SQL_QUERY.createActiveUserSession,
      token,
      (queryErro: Error, result: User[]) => {
        if (queryErro) {
          reject(queryErro);
        }
        resolve("New session created");
      }
    );
  });
};

const getActiveSessionByToken = (token: String) => {
  return new Promise((resolve, reject) => {
    connectionPool.query(
      SQL_QUERY.fetchActiveUserSession,
      token,
      (queryErro: Error, result: User[]) => {
        if (queryErro) {
          reject(queryErro);
        }
        if (result.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
};

const deleteActiveSessionByToken = (token: String) => {
  return new Promise((resolve, reject) => {
    connectionPool.query(
      SQL_QUERY.deleteActiveUserSession,
      token,
      (queryErro: Error, result: Object) => {
        if (queryErro) {
          console.log(queryErro)
          reject(queryErro);
        }
        resolve("Logged out successfully!");
      }
    );
  });
};

module.exports = {
  findUserByEmail,
  createNewUser,
  createActiveUserSession,
  getActiveSessionByToken,
  deleteActiveSessionByToken,
};
