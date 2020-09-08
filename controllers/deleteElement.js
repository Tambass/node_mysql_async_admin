// Supprime un élément

module.exports = {
  deleteElement: async (req, res) => {
    const id = req.params.id;

    const deleteFactory = await query("DELETE FROM factories WHERE id =" + id);

    const deleteEnergy = await query("DELETE FROM energies WHERE id =" + id);

    res.redirect("/");
  },
};
