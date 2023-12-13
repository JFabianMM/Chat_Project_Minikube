const mongoose = require('mongoose');
const logger = require("./logger");

// mongoose.connect(process.env.MONGODB3_URI)
mongoose.connect('mongodb://fabian:12345@mongodb1:27017/mydatabase3?authSource=admin')
    .then(db => logger.log("info", 'DB is connected'))
    .catch(err => logger.log("error", err));

module.exports = mongoose;
