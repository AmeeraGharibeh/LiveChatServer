const mongoose = require('mongoose');


const CountrySchema = mongoose.Schema({
   rooms_count: {
    type: Number,
    default: 0
  },
   users_count: {
    type: Number,
    default: 0
  },

  name_en: {
    type: String,
    default: '-'
  },
 
  name_ar: {
    type: String,
    required: true
  },
  img_url: {
    type: String,
    required: true
  },

});

module.exports = mongoose.model('Country', CountrySchema);
