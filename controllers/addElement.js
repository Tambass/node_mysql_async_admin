module.exports = {
  addElement: async (req, res) => {
    const factoryName = req.body.factoryName;
    const energyName = req.body.energyName;
    const addFactory = await query(
      "INSERT INTO factories (name) VALUES ('" + factoryName + "')"
    );
    const addEnergy = await query(
      "INSERT INTO energies (name) VALUES ('" + energyName + "')"
    );

    res.redirect("/");
  },
};
