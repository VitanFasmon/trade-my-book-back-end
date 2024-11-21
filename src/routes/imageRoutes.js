const express = require("express");
const { upload } = require("../utils/imageService");

const router = express.Router();

router.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(201).json({ url: imageUrl });
});

module.exports = router;
