const mongoose = require('mongoose');
const { Schema } = mongoose;

const messagesSchema = new Schema({
    identification: { 
        type: String,
        unique: true, 
        required: true,
        trim: true,
    },
    messagesInformation: [{
        alreadyread: { 
            type: String, 
            trim: true,
            },
        room: { 
            type: String, 
            trim: true,
            },
        users: [{
            id: { 
                type: String, 
                trim: true,
                }
        }],
        name: { 
            type: String, 
            maxlength: 30,
            trim: true,
        },
        messages: [{
            origin: { 
                type: String,
                trim: true,
            },
            firstName: { 
                type: String, 
                maxlength: 30,
                trim: true
            },
            lastName: { 
                type: String, 
                maxlength: 30,
                trim: true
            },
            message: { 
                type: String, 
                trim: true
            },
            time: { 
                type: String, 
                trim: true
            }
        }],
    }]
});

module.exports = mongoose.model('Messages', messagesSchema);
