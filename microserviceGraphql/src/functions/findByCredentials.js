const User = require('../models/user');
const bcrypt = require ('bcryptjs');

const findByCredentials = async function (email, password) {
    let user = await User.findOne({ email });
    if (!user){
        user = 'Do not exist';
        return user
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        user = 'Do not match';
        return user
    }
    return user
};

module.exports = findByCredentials; 