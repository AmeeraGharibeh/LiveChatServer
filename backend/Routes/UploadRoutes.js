// const router = require('express').Router();
// const multer = require('multer');
// const { Storage } = require('@google-cloud/storage');
// const gc = require('../Config');
// const bucket = gc.bucket('grocery-372908.appspot.com');

// const storage = new Storage();
// const upload = multer();

// router.post('/tmp', upload.single('image'), async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send({ message: "Please upload a file!" });
//     }

//     const timestamp = Date.now();
//     const uniqueFilename = `${timestamp}_${req.file.originalname.replace(/ /g, "_")}`;

//     const blob = bucket.file(uniqueFilename);
//     const blobStream = blob.createWriteStream({
//       resumable: false,
//     });

//     blobStream.on("error", (err) => {
//       res.status(500).send({ message: err.message });
//     });

//     blobStream.on("finish", async (data) => {
//       const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
//       try {
//         // Make the file public
//         await blob.makePublic();
//       } catch {
//         return res.status(500).send({
//           msg: "Uploaded the file successfully, but public access is denied!",
//           img_url: publicUrl,
//         });
//       }
//       res.status(200).send({
//         msg: "Uploaded the file successfully",
//         img_url: publicUrl,
//       });
//     });

//     blobStream.end(req.file.buffer);
//   } catch (err) {
//     res.status(500).send({
//       message: `Could not upload the file: ${req.file.originalname}. ${err}`,
//     });
//   }
// });

// module.exports = router;
// const router = require("express").Router();
// const multer = require("multer");
// const gc = require("../Config");
// const bucket = gc.bucket("grocery-372908.appspot.com");

// const upload = multer();

// router.post("/tmp", upload.array("images", 1), async (req, res, next) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res
//         .status(400)
//         .send({ message: "Please upload at least one file!" });
//     }

//     const uploadPromises = req.files.map((file) => {
//       // Generate a unique filename using a timestamp and original filename
//       const timestamp = Date.now();
//       const uniqueFilename = `${timestamp}_${file.originalname.replace(
//         / /g,
//         "_"
//       )}`;

//       const blob = bucket.file(uniqueFilename);
//       const blobStream = blob.createWriteStream({
//         resumable: false,
//       });

//       return new Promise((resolve, reject) => {
//         blobStream.on("error", (err) => {
//           reject(err);
//         });

//         blobStream.on("finish", async (data) => {
//           const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
//           try {
//             // Make the file public
//             await blob.makePublic();
//             resolve({ filename: uniqueFilename, url: publicUrl });
//           } catch {
//             reject(
//               new Error(
//                 `Uploaded the file '${uniqueFilename}' successfully, but public access is denied!`
//               )
//             );
//           }
//         });

//         blobStream.end(file.buffer);
//       });
//     });

//     Promise.all(uploadPromises)
//       .then((results) => {
//         res.status(200).send({
//           msg: "Uploaded files successfully",
//           files: results,
//         });
//       })
//       .catch((err) => {
//         res.status(500).send({
//           message: "Could not upload one or more files",
//           error: err.message,
//         });
//       });
//   } catch (err) {
//     res.status(500).send({
//       message: "Could not upload the files",
//       error: err.message,
//     });
//   }
// });

// module.exports = router;

const router = require("express").Router();
const multer = require("multer");
const gc = require("../Config");
const bucket = gc.bucket("grocery-372908.appspot.com");

const upload = multer();

router.post(
  "/tmp/:directory",
  upload.array("images", 1),
  async (req, res, next) => {
    try {
      const { directory } = req.params;

      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .send({ message: "Please upload at least one file!" });
      }

      const uploadPromises = req.files.map((file) => {
        const timestamp = Date.now();
        const uniqueFilename = `${directory}/${timestamp}_${file.originalname.replace(
          / /g,
          "_"
        )}`;

        const blob = bucket.file(uniqueFilename);
        const blobStream = blob.createWriteStream({
          resumable: false,
        });

        return new Promise((resolve, reject) => {
          blobStream.on("error", (err) => {
            reject(err);
          });

          blobStream.on("finish", async (data) => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            try {
              // Make the file public
              await blob.makePublic();

              // Resolve the promise with the correct data
              resolve({ filename: uniqueFilename, url: publicUrl });
            } catch (err) {
              // If making it public fails, resolve with an error
              resolve({
                filename: uniqueFilename,
                url: publicUrl,
                error: `Public access failed: ${err.message}`,
              });
            }
          });

          blobStream.end(file.buffer);
        });
      });

      Promise.all(uploadPromises)
        .then((results) => {
          res.status(200).send({
            msg: "Uploaded files successfully",
            files: results,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: "Could not upload one or more files",
            error: err.message,
          });
        });
    } catch (err) {
      res.status(500).send({
        message: "Could not upload the files",
        error: err.message,
      });
    }
  }
);

module.exports = router;
