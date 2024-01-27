const Emojie = require("../Models/EmojieModel");

const getEmojies = async (req, res) => {
  try {
    const emojies = await Emojie.find();
    const response = { emojies };
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addEmojie = async (req, res) => {
  const newEmojie = new Emojie(req.body.body);
  try {
    const saved = await newEmojie.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const deleteEmojie = async (req, res) => {
  try {
    await Emojie.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "تم حذف الإيموجي بنجاح", id: req.params.id });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const deleteEmojieByCategory = async (req, res) => {
  try {
    await Emojie.find({ category: req.params.category });

    // Delete all found emojis
    await Emojie.deleteMany({ category: req.params.category });

    res.status(200).json({
      msg: `تم حذف ${emojisToDelete.length} ايموجي من التصنيف${req.params.category}`,
      category: req.params.category,
    });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};
module.exports = {
  getEmojies,
  deleteEmojie,
  addEmojie,
  deleteEmojieByCategory,
};
