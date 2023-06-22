const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require ('bcryptjs');

const userSchema = new Schema({
    email: { 
        type: String,
        unique: true, 
        required: true,
        maxlength: 40,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        } 
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
    firstName: { 
        type: String, 
        required: true,
        maxlength: 30,
        trim: true
    },
    lastName: { 
        type: String, 
        required: true,
        maxlength: 30,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: String
    }
});


userSchema.pre('save', async function(next){
    const user = this;
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
})

module.exports = mongoose.model('User', userSchema);