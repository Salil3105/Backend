const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: {
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },

})


// exporting module 
module.exports = mongoose.model("token", tokenSchema);