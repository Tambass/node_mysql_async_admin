const express = require("express");
const fileUpload = require("express-fileupload");
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

// default options
app.use(fileUpload());

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

// **** CONTROLLERS **** //

const { getHomePage } = require("./controllers/getHomePage");
const { addElement } = require("./controllers/addElement");
const { addFile } = require("./controllers/addFile");
const { getEditFactory } = require("./controllers/getEditFactory");
const { putEditFactory } = require("./controllers/putEditFactory");
const { getEditEnergy } = require("./controllers/getEditEnergy");
const { putEditEnergy } = require("./controllers/putEditEnergy");
const { deleteElement } = require("./controllers/deleteElement");

// **** ROUTES **** //

// Affiche la page d'accueil
app.get("/", getHomePage);
// Permet d'ajouter un constructeur ou un carburant
app.post("/add", addElement);
// Permet d'ajouter une image
app.post("/addFile", addFile);
// Affiche la page d'édition du constructeur
app.get("/editFactory/:id", getEditFactory);
// Met à jour le constructeur
app.put("/editFactory/:id", putEditFactory);
// Affiche la page d'édition du carburant
app.get("/editEnergy/:id", getEditEnergy);
// Met à jour le carburant
app.put("/editEnergy/:id", putEditEnergy);
// Permet de supprimer un constructeur ou un carburant
app.delete("/:id", deleteElement);

// SERVER
app.listen(PORT, function () {
  console.log("Écoute le port : ", PORT);
});
