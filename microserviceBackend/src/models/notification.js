const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    identification: { 
        type: String,
        unique: true, 
        required: true,
        trim: true
    },
    notifications: [{
        id: { 
            type: String, 
            trim: true
            }
    }]
});

module.exports = mongoose.model('Notification', notificationSchema);
