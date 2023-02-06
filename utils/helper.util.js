const User = require("../model/user");
const Otp = require('../model/otpSchema');
var mongoose = require('mongoose');

module.exports = {

    generateOtp: () => {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        console.log("Otp is : " + otp);
        return otp;
    },

    checkUserExist: async (email) => {
        const user = await User.findOne({ email });
        if (user) {
            console.log("User exist");
            return true
        } else {
            return false
        }
    },

    updatePassword: async (req, res, next) => {
        try {
            
        } catch (error) {
            console.log(error);
        }
    },

}
