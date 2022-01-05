"use strict";
exports.SQL_QUERY = {
    // users
    fetchUserByEmail: "select * from users where email = ?",
    createNewUser: "insert into users(id, name, gender, age, email, contact, password) values(?, ?, ?, ?, ?, ?, ?)",
    createActiveUserSession: "insert into usersSession(token) values(?)",
    fetchActiveUserSession: "select * from usersSession where token = ?",
    deleteActiveUserSession: "delete from usersSession where token = ?",
};
