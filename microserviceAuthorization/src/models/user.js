const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require ('bcryptjs');

const userSchema = new Schema({
    identification: { 
        type: String,
        unique: true, 
        required: true,
        trim: true,
    },
    password: { 
        type: String, 
        required: true,
        minlength: 8,
        trim: true,
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});


// Hash the plain password before saving
userSchema.pre('save', async function(next){
    const user = this;
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
})

module.exports = mongoose.model('User', userSchema);