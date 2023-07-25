const mongoose = require('mongoose');
const { Schema } = mongoose;

const settingsSchema = new Schema({
    identification: { 
        type: String,
        unique: true, 
        required: true,
        trim: true,
    },
    language: { 
        type: String,
        trim: true,
    }
});

module.exports = mongoose.model('Settings', settingsSchema);