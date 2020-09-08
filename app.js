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
// Controllers

// Routes

app.get("/", async (req, res) => {
  //const query = ["SELECT * FROM factories", "SELECT * FROM energies"];

  const factories = await query("SELECT * FROM factories");
  const energies = await query("SELECT * FROM energies");
  const cars = await query("SELECT name, image FROM cars");

  console.log(factories);

  res.render("index", { factories, energies, cars });

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

app.post("/addFile", async (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  const imageUpload = req.files.image;

  const name = req.body.name;

  const image = `images/${imageUpload.name}`;

  try {
    if (
      imageUpload.mimetype === "image/jpeg" ||
      imageUpload.mimetype === "image/jpg" ||
      imageUpload.mimetype === "image/gif" ||
      imageUpload.mimetype === "image/png"
    ) {
      imageUpload.mv(`public/images/${imageUpload.name}`, async function (err) {
        if (err) {
          return res.status(500).send(err);
        }

        try {
          await query("INSERT INTO cars (name, image) VALUES (?, ?);", [
            name,
            image,
          ]);
        } catch (err) {
          res.send(err);
        }
      });
    } else {
      message = "Fichier invalide";
      res.render("/add", { message });
    }

    //console.log(imageUpload);
    await query;
    res.send("ok !");
  } catch (err) {
    res.send(err);
  }
  res.redirect("/");
});

// AFFICHE LA PAGE POUR ÉDITER LE NOM DU CONSTRUCTEUR SELON SON ID

app.get("/editFactory/:id", (req, res) => {
  const id = req.params.id;

  let query = "SELECT f.id, f.name FROM factories AS f WHERE f.id =" + id;

  db.query(query, (err, result) => {
    console.log(result);
    if (err) {
      res.send(err);
    }
    res.render("editFactory", { factories: result[0] });
  });
});

// ÉDITE LE NOM DU CONSTRUCTEUR SELON SON ID

app.put("/editFactory/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;

  let query =
    "UPDATE factories SET name = '" + name + "' WHERE id = '" + id + "'";

  db.query(query, (err, result) => {
    if (err) {
      return res.send(err);
    }
    res.redirect("/");
  });
});

// AFFICHE LA PAGE POUR ÉDITER LE NOM DU CARBURANT SELON SON ID

app.get("/editEnergy/:id", (req, res) => {
  res.render("editEnergy");
});

// ÉDITE LE NOM DU CARBURANT SELON SON ID

app.put("/editEnergy/:id", async (req, res) => {
  const id = req.params.id;
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
