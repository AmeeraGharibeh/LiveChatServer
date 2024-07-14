const { time } = require("../Config/Helpers/time_helper");
const NoticeModel = require("../Models/NoticeModel");

const getAllNoticeReports = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const totalItems = await NoticeModel.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(page, totalPages);
    const skip = Math.max((currentPage - 1) * limit, 0);

    const items = await NoticeModel.find().skip(skip).limit(limit);

    const response = {
      current_page: currentPage,
      per_page: limit,
      last_page: totalPages,
      total: totalItems,
      Reports: items,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createNoticeReport = async (req, res) => {
  const { room_id, noticed_username, noticed_device, noticed_ip } = req.body;
  const now = new Date();

  const notice = new NoticeModel({
    room_id,
    noticed_username,
    noticed_device,
    noticed_ip,
    report_date: time(now),
  });

  try {
    await notice.save();
    res.status(200).json({ msg: "تم التبليغ عن المستخدم بنجاح" });
  } catch (error) {
    return {
      msg: error.message,
    };
  }
};

const deleteNoticeReport = async (req, res) => {
  try {
    const result = await NoticeModel.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(200).json({ msg: "تم حذف التبليغ بنجاح" });
    } else {
      res.status(404).json({ msg: "تقرير التبليغ غير موجود" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
module.exports = {
  getAllNoticeReports,
  createNoticeReport,
  deleteNoticeReport,
};
