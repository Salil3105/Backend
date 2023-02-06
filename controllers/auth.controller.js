require("dotenv").config();
const bcryptjs = require("bcryptjs");
const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { google } = require("googleapis");
const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');

const OAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL,
);
OAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});
// console.log(OAuth2Client);


// import files
const { checkUserExist, generateOtp } = require("../utils/helper.util");
const User = require("../model/user");
const { json } = require("express");
const { TOKEN_KEY } = process.env;

module.exports = {

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log(req.body);

            // Validate user input 
            if (!(email && password)) {
                res.status(400).send("All inputs are required");
            }
            // Validate if user exist in our database
            const user = await User.findOne({ email });
            if (user && (await bcrypt.compare(password, user.password))) {
                //  Create Token
                const token = jwt.sign(
                    { user_id: user._id, email },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "1h",
                    }
                );

                // save user token 
                user.token = token;
                // user
                console.log("Login Successfully");
                res.status(200).send("Login Successfully");
            }
            else {
                res.status(400).send("Invalid Credentials, Login Failed")
            }

        } catch (error) {
            console.log("Error ", error);
        }
    },

    register: async (req, res) => {
        // Our Registeration logic goes here
        const { first_name, last_name, email, password } = req.body;
        console.log(req.body);
        try {
            const oldUser = await checkUserExist(email);
            if (oldUser) {
                // Check if user already exists
                return res.status(400).send("User already exists");
            }
            else {
                console.log('\nIn Register try part\n');
                // Get User Input

                // Validate the user 
                if (!first_name && !last_name && !email && !password) {
                    res.status(400).send("All input is required");
                }

                // Encrypt the password
                encryptedPassword = await bcryptjs.hash(password, 10);

                const user = await User.create({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: encryptedPassword,
                });

                // Generate a token
                console.log(TOKEN_KEY);
                const token = jwt.sign(
                    { user_id: user._id, email },
                    TOKEN_KEY,
                    {
                        expiresIn: '1hr',
                    }
                );

                // Save the user token
                user.token = token;
                // return new user
                res.status(201).json(user);
                console.log(user);
            }

        } catch (error) {
            console.log('\nIn Register Catch Error part\n');
            res.status(400).send("Error");
            console.log("Error : ", error);
        }
    },

    sendOtp: async (req, res) => {
        const { email } = req.body;
        try {
            if (await checkUserExist(email) == true) {
                res.status(200).send("User exist!")
                generateOtp();
            } else {
                res.status(400).send("User doesn't exist")
                console.log('Otp can not be generated');
            }
        } catch (error) {
            console.log("Error : " + error);
        }
    },

    sendMail: async (req, res) => {
        // try {
        //     const accessToken = await OAuth2Client.getAccessToken();
        //     console.log("Access Token is : \n", accessToken);

        //     const transport = nodemailer.createTransport({
        //         service: 'gmail',
        //         auth: {
        //             type: 'OAuth2',
        //             user: 'salilchandwadkar@gmail.com',
        //             clientId: process.env.GOOGLE_CLIENT_ID,
        //             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        //             refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        //             accessToken: accessToken
        //         }

        //     })

        //     const mailOption = {
        //         from: 'YoursTruly <salilchandwadkar@gmail.com>',
        //         to: 'schandwadkar31@gmail.com',
        //         subject: "Hello world !",
        //         text: "Hi !",
        //         html: "<h1>Hi, Hello</h1>"
        //     }

        //     const result = await transport.sendMail(mailOption);
        //     console.log(result);
        //     res.status(200).send("Successfully Sent !")
        // }
        // catch (error) {
        //     console.log("Error : ", error);
        //     res.status(400).send({ "success": "false", "msg": "Try again !" });
        // }

        // --------------------------------------------------------------------------------------- 

        // try {
        //     const transport = nodemailer.createTransport({
        //         service: "hotmail",
        //         secureConnection: false, // TLS requires secureConnection to be false
        //         port: 587, // port for secure SMTP
        //         tls: {
        //             ciphers: 'SSLv3'
        //         },

        //         auth: {
        //             user: process.env.EMAIL_ID,
        //             pass: process.env.EMAIL_PASSWORD
        //         }
        //     });

        //     const transporter = nodemailer.createTransport(transport)

        //     const options = {
        //         from: process.env.EMAIL_ID,
        //         to: "schandwadkar31@gmail.com",
        //         subject: "Reset password",
        //         text: "Here is a reset token."
        //     }

        //     transporter.sendMail(options, (error, info) => {
        //         if (error) console.log(error)
        //         else console.log(info)
        //     });
        //     res.status(200).send('Successfully Send');

        // }
        // catch (error) {
        //     res.status(400).send("Error");
        //     console.log(error);
        // }

        // --------------------------------------------------------------------------------------- 
        // TODO:  Using mailgun-js 
        // try {
        //     const message = {
        //         from: 'salilchandwadkar@gmail.com',
        //         to: 'salilchandwadkar31@gmail.com',
        //         subject: 'Hello MailGun Services',
        //         text: 'Testing some Mailgun awesomeness!'
        //     };

        //     mailgun.messages().send(message, function (error, body) {
        //         console.log(error);
        //     });

        //     res.status(200).send("Successfully send !");
        // }

        // catch (error) {
        //     console.log(error);
        //     res.status(400).send('Try Again!');
        // }

        // ----------------------------------------------
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'ivory53@ethereal.email',
                    pass: 'd2YESrMwTY9ttT4SD9'
                }
            });
            const mailOption = transporter.sendMail({
                from: 'salilchandwadkar@gmail.com',
                to: 'schandwadkar31@gmail.com',
                subject: "For Reset Password",
                text: "Hello World !",
                // html: `<p>Hi + Please copy the link <a href="http://localhost:4000/auth/reset-password?token+${token}"> and reset your password.</a></p>`
                html
            });

            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.log("Error" + error);
                } else {
                    res.status(200).send("Mail has been send successfully ");
                    console.log("Mail has been send successfully ", info.response);
                }
            })

        } catch (error) {
            res.status(400);
        }
    },

    sendresetPasswordMail: async (name, email, token) => {
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'ivory53@ethereal.email',
                    pass: 'd2YESrMwTY9ttT4SD9'
                }
            });
            const mailOption = transporter.sendMail({
                from: email,
                to: 'schandwadkar31@gmail.com',
                subject: "For Reset Password",
                text: "Hello World !",
                // html: `<p>Hi + ${name} + Please copy the link <a href="http://localhost:4000/auth/reset-password?token+${token}"> and reset your password.</a></p>`

            })
            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.log("Error" + error);
                } else {
                    console.log("Mail has been send successfully ", info.response);
                }
            })

        } catch (error) {
            res.status(400);
        }
    },

    forgot_password: async (req, res) => {
        try {
            const { first_name, email } = req.body;
            console.log("Email : ", email);
            const user = await checkUserExist(email);
            if (user) {
                console.log("User exist");
                const randomString = randomstring.generate();
                await User.updateOne({ email: email }, { $set: { token: randomString } });
                res.status(200).send({ "success": "true", "msg": "Please check your inbox of mail and reset your password" });
                this.sendresetPasswordMail(first_name, email, randomString)

            } else {
                console.log("User not existed");
                res.status(200).send({
                    "success": "false",
                    "msg": "The user doesn't exist!"
                });
            }

        } catch (error) {
            console.log(error);
            res.status(400).json(
                {
                    "success": false,
                    "error": "error",
                }
            )
        }
    }



}