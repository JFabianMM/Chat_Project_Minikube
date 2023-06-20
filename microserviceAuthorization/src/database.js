const mongoose = require('mongoose');

//mongoose.connect('mongodb://fabian:12345@mongodb3:27017/mydatabase?authSource=admin')
mongoose.connect(process.env.MONGODB3_URI)
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));

module.exports = mongoose;
