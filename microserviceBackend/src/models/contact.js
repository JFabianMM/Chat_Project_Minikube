const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
    identification: { 
        type: String,
        unique: true, 
        required: true,
        trim: true,
    },
    contacts: [{
        id: { 
            type: String, 
            trim: true,
            },
        room: { 
            type: String, 
            trim: true,
        }
    }]
});

module.exports = mongoose.model('Contact', contactSchema);


