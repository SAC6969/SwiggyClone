import User from "../models/User";
import { Utils } from "../utils/Utils";
import { NodeMailer } from "../utils/NodeMailer";
import * as Jwt from 'jsonwebtoken';
import { getEnvironmentVariables } from "../environments/environment";

export class UserController {
    static login(req, res, next) {
        const email = req.body.email;
        const password = req.body.password;

        const user = new User({
            email,
            password
        })

        user.save().then((user) => {
            res.send(user);
        }).catch(e => {
            next(e);
        });
    }

    static async signup(req, res, next) {
        try {
            const { name, email, phone, password, passwordConfirmation, type, status } = req.body;

            // generating code
            const verification_token = Utils.generateVerificationToken(6);
            const verification_token_time = Date.now() + new Utils().MAX_TOKEN_TIME;

            //password encryption 
            const hash = await Utils.encryptPassword(req.body.password);

            const data = { name, email, verification_token, verification_token_time, phone, password: hash, type, status };

            // creating user
            const user = await new User(data).save();

            //token
            const payload = {
                user_id: user._id,
            };
            
            const token = Jwt.sign(payload,getEnvironmentVariables().jwt_secret_key,{expiresIn: '1d'});

            //send otp to email 
            await NodeMailer.sendMail({
                to: [user.email],
                subject: 'code verification for swiggy clone',
                html: `<h1>Your otp is ${verification_token}. This otp expires in 10 minutes. Do not share this otp with anyone</h1>`
            })

            return res.status(201).json({ message: 'Sign Up Successfully', token:token});

        } catch (e) {
            let message;
            if (e.code === 11000 && e.keyPattern && e.keyPattern.phone === 1) {
                message = 'Phone number already exists';
            } else if (e.code === 11000 && e.keyPattern && e.keyPattern.email === 1) {
                message = 'Email already exists';
            } else {
                message = e
            }
            return res.status(400).json({ message: message });
        }
    }

    static async verify(req, res, next) {
        try {
            const { email, verification_token } = req.body;

            //find in User table
            const user = await User.findOneAndUpdate({
                email: email,
                verification_token: verification_token,
                verification_token_time: { $gt: Date.now() }
            }, {
                email_verified: true
            }, {
                new: true
            });

            if (user) {
                return res.status(200).json({ message: 'Email verified successfully' });
            } else {
                throw new Error('Email Verification Token Is Expired.Please try again...');
            }
        } catch (e) {
            next(e);
        }
    }

    static async resendVerificationEmail(req, res, next) {
        try {
            const email = req.query.email;
            const verification_token = Utils.generateVerificationToken();

            //find in User table
            const user = await User.findOneAndUpdate({
                email: email,
            }, {
                verification_token: verification_token,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
            });

            if (user) {
                await NodeMailer.sendMail({
                    to: [email],
                    subject: 'Resend Email verification for swiggy clone',
                    html: `<h1>Your otp is ${verification_token}. This otp expires in 10 minutes. Do not share this otp with anyone</h1>`
                })

                return res.status(200).json({ success: true, message: 'Otp sent to email' });
            } else {
                throw new Error('User doesn\'t exsit');
            }
        } catch (e) {
            next(e);
        }
    }
}