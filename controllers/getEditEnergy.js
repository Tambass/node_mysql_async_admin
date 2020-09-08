// AFFICHE LA PAGE POUR ÉDITER LE NOM DU CARBURANT SELON SON ID

module.exports = {
  getEditEnergy: (req, res) => {
    const id = req.params.id;

    let query = "SELECT e.id, e.name FROM energies AS e WHERE e.id =" + id;

    db.query(query, (err, result) => {
      console.log(result);
      if (err) {
        res.send(err);
      }
      res.render("editEnergy", { energies: result[0] });
    });
  },
};
