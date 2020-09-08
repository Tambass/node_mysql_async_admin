module.exports = {
  addFile: async (req, res) => {
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
        imageUpload.mv(`public/images/${imageUpload.name}`, async function (
          err
        ) {
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
  },
};
