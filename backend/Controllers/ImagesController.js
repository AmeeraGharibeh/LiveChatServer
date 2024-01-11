const Images = require("../Models/AppImages");

const getImages = async (req, res) => {
  try {
    const directoryQuery = req.query.directory;

    let query = {};
    if (directoryQuery) {
      query = { directory: directoryQuery };
    }

    const images = await Images.find(query);
    const response = { images };
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteImage = async (req, res) => {
  try {
    await Images.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "تم حذف الصورة بنجاح" });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};
module.exports = {
  getImages,
  deleteImage,
};
