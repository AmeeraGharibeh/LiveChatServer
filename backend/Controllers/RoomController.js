const Rooms = require('../Models/RoomModel');
const User = require('../Models/UserModel')
const bcrypt = require('bcryptjs');

const createRoom = async (req, res)=> {
  console.log(req.body)
const newRoom = new Rooms(req.body.body);
try {
    const saved = await newRoom.save();

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.room_password, salt);

    const newUser = new User({
    username: req.body.username,
    room_password: hashedPass,
    room_id: saved.room_id,
});

    await newUser.save();
    res.status(200).json(saved);


} catch (err) {
        res.status(500).send({msg: err.message});
}
};

const getAllRooms = async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 
 
  try {
    const totalItems = await Rooms.countDocuments(); 
    const totalPages = Math.ceil(totalItems / limit); 
    const currentPage = Math.min(page, totalPages); 
    const skip = Math.max((currentPage - 1) * limit, 0);

    const items = await Rooms.find()
      .skip(skip)
      .limit(limit);

    const response = {
      current_page: currentPage,
      per_page: limit,
      last_page: totalPages,
      total: totalItems,
      Rooms: items,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllRoomsByCountry = async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 
  const countryId = req.params.id; 

  try {
    const totalItems = await Rooms.countDocuments({ room_country: countryId }); 
    const totalPages = Math.ceil(totalItems / limit); 
    const currentPage = Math.min(page, totalPages); 
    const skip = Math.max((currentPage - 1) * limit, 0);

    const items = await Rooms.find({ room_country: countryId })
      .skip(skip)
      .limit(limit);

    const response = {
      current_page: currentPage,
      per_page: limit,
      last_page: totalPages,
      total: totalItems,
      Rooms: items,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSpecialRooms = async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 

  try {
    const totalItems = await Rooms.countDocuments({ room_type: 'special' }); 
    const totalPages = Math.ceil(totalItems / limit); 
    const currentPage = Math.min(page, totalPages); 
    const skip = Math.max((currentPage - 1) * limit, 0);

    const items = await Rooms.find({ room_type: 'special' })
      .skip(skip)
      .limit(limit);

    const response = {
      current_page: currentPage,
      per_page: limit,
      last_page: totalPages,
      total: totalItems,
      Rooms: items,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getRoomUsers = async (req, res)=> {
    const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 
  const roomId = req.params.id; 

  try {
    const totalItems = await User.countDocuments({ room_id: roomId }); 
    const totalPages = Math.ceil(totalItems / limit); 
    const currentPage = Math.min(page, totalPages); 
    const skip = Math.max((currentPage - 1) * limit, 0);

    const items = await User.find({ room_id: roomId })
      .skip(skip)
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
    res.status(500).json({ message: 'Internal server error' });
  }
}
const searchRoom = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { room_name: { $regex: req.query.search, $options: "i" } }
        ],
      }
    : {};

  const rooms = await Rooms.find(keyword);
  res.send({Rooms: rooms});
};

const getRoom = async (req, res) => {
 
   try {
        const room = await Rooms.findById(req.params.id);
            res.status(200).json(room);

} catch (err) {
    res.status(500).send({msg: err.message});
}
};

const updateRoom = async (req, res) => {
      console.log(req.body)

try {
    const updated = await Rooms.findByIdAndUpdate(req.params.id, 
        {
            $set: req.body.body,
        }, 
        {
            new: true
        } );
    res.status(200).json({msg: 'تم تعديل الغرفة بنجاح!', room: updated});

} catch (err) {
        res.status(500).send({msg: err.message});
}
};

const deleteRoom= async (req, res) => {
 
   try {
         await Rooms.findByIdAndDelete(req.params.id);
            res.status(200).json({msg: 'room has been deleted.. '});

} catch (err) {
    res.status(500).send({msg: err.message});
}
};
module.exports = {createRoom, getAllRooms, getAllRoomsByCountry, getSpecialRooms,
   getRoom, deleteRoom, updateRoom, searchRoom, getRoomUsers};