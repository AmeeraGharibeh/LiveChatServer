const mongoose = require('mongoose');

const PictureSchema = mongoose.Schema({
   pic_url: {
    type: String,
    required: true
  },

   text: {
    type: String,
    default: '-'
  },

}, { timestamps : true });

module.exports = mongoose.model('Picture', PictureSchema);