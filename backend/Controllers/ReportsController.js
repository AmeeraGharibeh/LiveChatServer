const Reports = require('../Models/ReportsModel');

const getAllReports = async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 
 
  try {
    const totalItems = await Reports.countDocuments({room_id : req.params.id}); 
    const totalPages = Math.ceil(totalItems / limit); 
    const currentPage = Math.min(page, totalPages); 
    const skip = Math.max((currentPage - 1) * limit, 0);

    const items = await Reports.find({room_id : req.params.id})
      .skip(skip)
      .limit(limit);

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
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {getAllReports};