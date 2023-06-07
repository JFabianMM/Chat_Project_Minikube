const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
    identification: { 
        type: String,
        unique: true, 
        required: true,
        trim: true,
    },
    groups: [{
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
            maxlength: 30,
            lowercase: true,
        }
    }]

});

module.exports = mongoose.model('Group', groupSchema);