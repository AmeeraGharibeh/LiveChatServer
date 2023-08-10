const Blocked = require("../Models/BlockedModel");

const getBlockedUsers = async (req, res) => {
  const query = req.query.query;
  let items = [];

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    let search = {};

    if (query === "ip") {
      search.device = "-";
    } else if (query === "device") {
      search.ip = "-";
    }

    const totalItems = await Blocked.countDocuments(search);
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(page, totalPages);

    items = await Blocked.find(search)
      .skip((currentPage - 1) * limit)
      .limit(limit);

    const response = {
      current_page: currentPage,
      per_page: limit,
      last_page: totalPages,
      total: totalItems,
      users: items,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getBlockedUsers };
