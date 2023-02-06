const { User, validate } = require('../models/user');
const express = require('express');

const router = express.Router();

router.post('/users', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            const User = await new User(req.body).save();
            res.send(User);
            return res.status(400).send(error);
        }
    } catch (error) {
        res.send("An Error Occured");
        console.log(error);
    }
});

module.exports = router ;
