const express = require('express');
const router = express.Router()

const { sendOtp, login, register, sendMail, resetPassword, forgot_password } = require("../controllers/auth.controller");
const { updatePassword, checkUserExist } = require('../utils/helper.util');
require("../config/database").connect();

router.use(express.json());

// Login goes here ...
router.post('/login', login);
// Register a new user
router.post('/register', register);
// Send Otp here 
router.post('/sendOtp', sendOtp);

router.post('/sendMail', sendMail);

router.post('/forgot_password', forgot_password);

module.exports = router;
