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
    if (req.params.id) {
      // Delete by ID
      await Emojie.findByIdAndDelete(req.params.id);
      console.log("by id " + req.params.id);
      res.status(200).json({ msg: "تم حذف الإيموجي بنجاح", id: req.params.id });
    } else if (req.params.category) {
      // Delete by Category
      console.log("by category " + req.params.category);
      const emojisToDelete = await Emojie.deleteMany({
        category: req.params.category,
      });
      res.status(200).json({
        msg: `تم حذف ${emojisToDelete.deletedCount} ايموجي من التصنيف ${req.params.category}`,
        category: req.params.category,
      });
    } else {
      res.status(400).json({ msg: "يجب توفير معرف الإيموجي أو فئة التصنيف." });
    }
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

module.exports = {
  getEmojies,
  deleteEmojie,
  addEmojie,
};
