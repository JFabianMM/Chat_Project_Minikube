const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    identification: { 
        type: String,
        unique: true, 
        required: true,
        trim: true,
    },
    firstName: { 
        type: String, 
        required: true,
        trim: true
    },
    lastName: { 
        type: String, 
        required: true,
        trim: true
    },
});

module.exports = mongoose.model('User', userSchema);