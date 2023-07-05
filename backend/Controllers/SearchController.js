const Rooms = require('../Models/RoomModel');
const Country = require('../Models/CountryModel')

const search = async (req, res)=> {
    const query = req.query.q;

  try {
    const { title } = req.query;

    const result = await Promise.all([
     Rooms.find({ 'room_name': title }).toArray(),
    Country.find({
        $or: [
          { 'name_ar': title },
          { 'name_en': title }
        ]
      }).toArray()
    ]);

    const rooms = result[0];
    const countries = result[1];

    if (rooms.length > 0 || countries.length > 0) {
      return res.status(200).json({ rooms, countries });
    }

    return res.status(200).json({ message: 'No results found.' });

  } catch (err) {
    return res.status(err.code).json({ error: err.error });
  }
}

module.exports = {search}