const Blocked = require('../Models/BlockedModel')

const getBlockedUsers = async (req, res) => {
      const query = req.query.query
      let items = [];

  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of items per page

  try {
    if(query == 'ip'){
    const totalItems = await Country.countDocuments({ip: true}); // Count total items in the collection
    const totalPages = Math.ceil(totalItems / limit); // Calculate total pages
    const currentPage = Math.min(page, totalPages); // Ensure current page is within range

    items = await Country.find({ip})
      .skip((currentPage - 1) * limit)
      .limit(limit);

    } else if (query == 'device'){
  const totalItems = await Country.countDocuments({ip: false}); // Count total items in the collection
    const totalPages = Math.ceil(totalItems / limit); // Calculate total pages
    const currentPage = Math.min(page, totalPages); // Ensure current page is within range

    items = await Country.find({device})
      .skip((currentPage - 1) * limit)
      .limit(limit);
    }

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
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = {getBlockedUsers};
