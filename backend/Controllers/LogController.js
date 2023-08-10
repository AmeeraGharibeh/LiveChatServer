const Logs = require("../Models/LogModel");

const getAllLogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const totalItems = await Logs.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(page, totalPages);
    const skip = Math.max((currentPage - 1) * limit, 0);

    const items = await Logs.find().skip(skip).limit(limit);

    const response = {
      current_page: currentPage,
      per_page: limit,
      last_page: totalPages,
      total: totalItems,
      Logs: items,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLogsByUserID = async (req, res) => {
  try {
    const items = await Logs.find({ user_id: req.params.id });
    res.status(200).json({ Logs: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLogsByRoom = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const totalItems = await Logs.countDocuments({ room_id: req.params.id });
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(page, totalPages);
    const skip = Math.max((currentPage - 1) * limit, 0);

    const items = await Logs.find({ room_id: req.params.id })
      .skip(skip)
      .limit(limit);

    const response = {
      current_page: currentPage,
      per_page: limit,
      last_page: totalPages,
      total: totalItems,
      Logs: items,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteAllLogs = async (req, res) => {
  try {
    // const report = new ReportsModel({
    //   master_name: req.body.master,
    //   action_user: req.body.username,
    //   action_name_ar: "حذف جميع السجلات",
    //   action_name_en: "Delete all logs",
    // });
    // await report.save();

    const deleteResult = await Logs.deleteMany({});
    const deletedCount = deleteResult.deletedCount;

    res.status(200).json({ msg: `تم حذف ${deletedCount} سجل بنجاح!` });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

module.exports = { getAllLogs, getLogsByRoom, getLogsByUserID, deleteAllLogs };
