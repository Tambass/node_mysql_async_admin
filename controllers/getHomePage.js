module.exports = {
  getHomePage: async (req, res) => {
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
  },
};
