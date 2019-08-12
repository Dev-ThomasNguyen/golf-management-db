const pgp = require("pg-promise")({
  query: e => {}
});

const options = {
  host: "localhost",
  database: "yardboys",
  password: "",
  user: "thomasnguyen"
};
const db = pgp(options);

module.exports = db;
