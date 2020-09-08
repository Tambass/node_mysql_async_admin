// ÉDITE LE NOM DU CARBURANT SELON SON ID

module.exports = {
  putEditEnergy: (req, res) => {
    const id = req.params.id;
    const name = req.body.name;

    let query =
      "UPDATE energies SET name = '" + name + "' WHERE id = '" + id + "'";

    db.query(query, (err, result) => {
      if (err) {
        return res.send(err);
      }
      res.redirect("/");
    });
  },
};
