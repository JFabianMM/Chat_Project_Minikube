const Settings = require('../models/settings');

const findSettings = async function (identification) {
    const settings = await Settings.findOne({ identification });
    return settings
};

module.exports = findSettings;