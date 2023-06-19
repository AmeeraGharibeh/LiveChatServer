const Cloud = require('@google-cloud/storage')
const path = require('path');
const keyFilename = path.join(__dirname, './grocery-372908-ff0ac3871e9e.json');


const { Storage } = Cloud
const storage = new Storage({
  keyFilename: keyFilename,
  projectId: 'grocery-372908',
})

module.exports = storage