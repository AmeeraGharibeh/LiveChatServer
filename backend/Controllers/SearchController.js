const Rooms = require('../Models/RoomModel');
const Country = require('../Models/CountryModel')

const search = async (req, res)=> {
  try {
  const keyword = req.query.search ?
    {
        $or: [
        { room_name: { $regex: req.query.search, $options: "i" } },
        { name_ar: { $regex: req.query.search, $options: "i" } },
        { name_en: { $regex: req.query.search, $options: "i" } },

        ],
      } : {}

  const rooms = await Rooms.find(keyword);
  const countries = await Country.find(keyword);

    if (rooms.length > 0 || countries.length > 0) {
       res.status(200).json({result: { rooms, countries} });
    }

    return res.status(200).json({ msg: 'لا توجد نتائج' });

  } catch (err) {
     res.status(500).json({ msg: err.message });
  }
}

module.exports = {search}