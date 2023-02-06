const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    token: {
        type: String,
        default : ''
    }
});

module.exports = mongoose.model("users", userSchema);
