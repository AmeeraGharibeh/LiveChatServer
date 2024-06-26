const mongoose = require("mongoose");

const RoomSchema = mongoose.Schema({
  room_name: {
    type: String,
    required: true,
  },
  room_owner: {
    type: String,
    required: true,
  },
  room_type: {
    type: String,
    required: true,
  },
  room_code: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  room_country: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "-",
  },
  room_img: {
    type: String,
    default: "-",
  },

  welcome_msg: {
    type: String,
    default: "-",
  },
  room_duration: {
    type: Number,
    default: 0,
  },

  room_capacity: {
    type: Number,
    default: 0,
  },

  start_date: {
    type: String,
  },

  end_date: {
    type: String,
  },

  account_limits: {
    type: {},
  },

  room_lock_status: {
    type: String,
    default: "open",
  },
  close_msg: {
    type: String,
  },
  room_color: {
    type: Number,
    default: 0xff9bb1ba,
  },
  who_can_talk: {
    type: String,
    default: "all",
  },
  speak_duration: {
    type: {},
    default: {
      visitor: 300,
      member: 300,
      admin: 300,
      super_admin: 300,
      master: 300,
    },
  },
  who_can_cam: {
    type: String,
    default: "all",
  },
  who_can_send_private: {
    type: String,
    default: "all",
  },
  add_master: {
    type: Boolean,
    default: true,
  },
  change_room_settings: {
    type: Boolean,
    default: true,
  },
  lock_reason: {
    type: String,
    default: "-",
  },
});

module.exports = mongoose.model("Room", RoomSchema);

/*const AccountLimitsSchema = mongoose.Schema({
    admin : {
        type : Number, 
        required : true, 
    },
     super_admin : {
        type : Number, 
        required : true, 
    },
     master : {
        type : Number, 
        required : true, 
    },
     member : {
        type : Number, 
        required : true, 
    },
    

},{ timestamps : true });

module.exports = mongoose.model('AccountLimit', AccountLimitsSchema);

const MasterAdvancedSchema = mongoose.Schema({
    add_master : {
        type : Boolean, 
        default: false 
    },
     manage_room : {
        type : Boolean, 
        default : false, 
    },
    

},);

module.exports = mongoose.model('MasterAdvanced', MasterAdvancedSchema);


*/
