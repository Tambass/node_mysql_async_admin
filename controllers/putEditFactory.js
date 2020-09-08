// ÉDITE LE NOM DU CONSTRUCTEUR SELON SON ID

module.exports = {
  putEditFactory: (req, res) => {
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
  },
};
