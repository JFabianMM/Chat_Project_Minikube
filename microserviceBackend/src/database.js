const mongoose = require('mongoose');
const logger = require("./logger");

mongoose.connect('mongodb://fabian:12345@mongodb1:27017/mydatabase2?authSource=admin')
    .then(db => logger.log("info", 'DB is connected'))
    .catch(err => logger.log("error", err));

module.exports = mongoose;
