// AFFICHE LA PAGE POUR ÉDITER LE NOM DU CONSTRUCTEUR SELON SON ID

module.exports = {
  getEditFactory: (req, res) => {
    const id = req.params.id;

    let query = "SELECT f.id, f.name FROM factories AS f WHERE f.id =" + id;

    db.query(query, (err, result) => {
      console.log(result);
      if (err) {
        res.send(err);
      }
      res.render("editFactory", { factories: result[0] });
    });
  },
};
