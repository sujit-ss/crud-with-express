const { createPool } = require("mysql");

const connectionPool = createPool({
  host: "localhost",
  user: "root",
  password: "SoftSuave#123",
  database: "CRUD",
  connectionLimit: 10,
});

module.exports = connectionPool;
