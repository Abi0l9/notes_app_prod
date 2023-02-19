require("dotenv").config();

let PORT = process.env.PORT;
let DB = process.env.DB;

module.exports = { PORT, DB };
