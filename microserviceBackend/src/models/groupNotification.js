const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupNotificationSchema = new Schema({
    identification: { 
        type: String,
        unique: true, 
        required: true,
        trim: true,
    },
    groupNotifications: [{
        room: { 
            type: String, 
            trim: true,
        },
        creator: { 
            type: String, 
            trim: true,
        },
        members: [{
            id: { 
                type: String, 
                trim: true,
                }
        }],
        name: { 
            type: String,
            trim: true,
            maxlength: 20,
        }
    }]
});

module.exports = mongoose.model('GroupNotification', groupNotificationSchema);

