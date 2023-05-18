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
        alreadyread: Boolean,
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
            id: { 
                type: Number, 
                trim: true,
                },
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
            position: { 
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
