const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const mysql = require("mysql");
const util = require("util");
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
  // multipleStatements: true,
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connecté à la base MySQL");
});
const query = util.promisify(db.query).bind(db);
global.db = db;
global.query = query;
// Controllers

// Routes

app.get("/", async (req, res) => {
  //const query = ["SELECT * FROM factories", "SELECT * FROM energies"];

  const factories = await query("SELECT * FROM factories");
  const energies = await query("SELECT * FROM energies");

  console.log(factories);

  res.render("index", { factories, energies });

  // db.query(query, (err, result) => {
  // console.log(result);
  //res.render("index", { factories: result[0], energies: result[1] });
  //});
});

app.post("/add", async (req, res) => {
  const factoryName = req.body.factoryName;
  const energyName = req.body.energyName;
  const addFactory = await query(
    "INSERT INTO factories (name) VALUES ('" + factoryName + "')"
  );
  const addEnergy = await query(
    "INSERT INTO energies (name) VALUES ('" + energyName + "')"
  );

  res.redirect("/");
});

app.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const deleteFactory = await query("DELETE FROM factories WHERE id =" + id);

  const deleteEnergy = await query("DELETE FROM energies WHERE id =" + id);

  res.redirect("/");
});

// SERVER
app.listen(PORT, function () {
  console.log("Écoute le port : ", PORT);
});
