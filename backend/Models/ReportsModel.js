const mongoose = require('mongoose');


const ReportsSchema = mongoose.Schema({
   master_name: {
    type: String,
    required: true

  },
  room_id: {
    type: String,
    required: true
  },
   action_user: {
    type: String,
    default: '-'
  },

  action_name_ar: {
    type: String,
    default: '-'
  },
 
  action_name_en: {
    type: String,
    default: '-'
  },

},{ timestamps : true });

module.exports = mongoose.model('Reports', ReportsSchema);