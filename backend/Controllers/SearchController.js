const Rooms = require('../Models/RoomModel');
const Country = require('../Models/CountryModel')

const search = async (req, res)=> {
  try {
    const { title } = req.query;

  
    const rooms = await Rooms.find({ 'room_name': title }).toArray();
    const countries = await Country.find({
      $or: [
        { 'name_ar': title },
        { 'name_en': title }
      ]
    }).toArray();

    if (rooms.length > 0 || countries.length > 0) {
       res.status(200).json({ rooms, countries });
    }

    return res.status(200).json({ message: 'No results found.' });

  } catch (err) {
     res.status(500).json({ error: err.error });
  }
}

module.exports = {search}