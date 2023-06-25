const mongoose = require('mongoose');


const RoomSchema = mongoose.Schema({
   room_name: {
    type: String,
    required: true
  },
   room_owner: {
    type: String,
    required: true
  },
  room_type: {
    type: String,
    required: true
  },
   email: {
    type: String,
    required: true
  },

   room_country: {
    type: String,
    required: true
  },

   description: {
    type: String,
    default: '-'
  },
 
   welcome_msg: {
    type: String,
    default: '-'
  },
  room_duration: {
    type: Number,
    default: 0
  },

   room_capacity: {
    type: Number,
    default: 0
  },

   start_date: {
    type: String,
  },

   end_date: {
    type: String,
  },
 
   account_limits: {
    type: {}
},

 room_open: {
    type: String,
    default: 'open'
},
close_msg: {
  type: String,
},
room_color: {
  type: Number,
  default: 0xff1693c3
}

});

module.exports = mongoose.model('Room', RoomSchema);


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