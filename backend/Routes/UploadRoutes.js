const router = require('express').Router();
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const gc = require('../Config');
const bucket = gc.bucket('grocery-372908.appspot.com');

const storage = new Storage();
const upload = multer();

router.post('/tmp', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}_${req.file.originalname.replace(/ /g, "_")}`;

    const blob = bucket.file(uniqueFilename);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", async (data) => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      try {
        // Make the file public
        await blob.makePublic();
      } catch {
        return res.status(500).send({
          msg: "Uploaded the file successfully, but public access is denied!",
          img_url: publicUrl,
        });
      }
      res.status(200).send({
        msg: "Uploaded the file successfully",
        img_url: publicUrl,
      });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
});

module.exports = router;
