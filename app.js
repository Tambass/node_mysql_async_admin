const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const mysql = require("mysql");
const PORT = 8000;
const app = express();
app.set("view engine", "ejs");

require("dotenv").config();

// Method OverRide
app.use(methodOverride("_method"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static
app.use(express.static(path.join(__dirname, "public")));

// Mysql
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATA,
  multipleStatements: true,
});
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connecté à la base MySQL");
});
global.db = db;

// Controllers

// Routes

app.get("/", (req, res) => {
  const query = ["SELECT * FROM factories", "SELECT * FROM energies"];

  db.query(query.join(";"), (err, result) => {
    console.log(result);
    res.render("index", { factories: result[0], energies: result[1] });
  });
});

// SERVER
app.listen(PORT, function () {
  console.log("Écoute le port : ", PORT);
});
