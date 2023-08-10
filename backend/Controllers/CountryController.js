const Country = require("../Models/CountryModel");
const Rooms = require("../Models/RoomModel");
const Users = require("../Models/UserModel");

const createCountry = async (req, res) => {
  const newCountry = new Country(req.body.body);
  try {
    const saved = await newCountry.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const getAllCountries = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const totalItems = await Country.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(page, totalPages);

    const items = await Country.find()
      .skip((currentPage - 1) * limit)
      .limit(limit);

    const response = {
      current_page: currentPage,
      per_page: limit,
      last_page: totalPages,
      total: totalItems,
      countries: items,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCountry = async (req, res) => {
  try {
    const updated = await Country.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const deleteCountry = async (req, res) => {
  try {
    const filter = { room_country: req.params.id };
    await Country.findByIdAndDelete(req.params.id);
    const rooms = await Rooms.find(filter);
    rooms.forEach(async (e) => {
      const usersFilter = { room_id: e.id };
      await Users.deleteOne(usersFilter);
    });
    await Rooms.deleteMany(filter);

    res.status(200).json({ msg: "country has been deleted.. " });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};
module.exports = {
  createCountry,
  getAllCountries,
  deleteCountry,
  updateCountry,
};
