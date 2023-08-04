const mongoose = require('mongoose');
const logger = require("./logger");

mongoose.connect(process.env.MONGODB1_URI)
    .then(db => logger.log("info", 'DB is connected'))
    .catch(err => logger.log("error", err));

module.exports = mongoose;
