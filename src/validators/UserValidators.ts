import { body, query } from "express-validator";
import User from "../models/User";

export class UserValidators{
    static signup(){
        return [
            body('name','Name is required').isString(),
            body('email','Email is required').isEmail()
            .custom((email,{req})=>{
                return User.findOne({
                    email:email
                }).then(user => {
                    if(user){
                        throw new Error('Email Already Exists');                        
                    }else{
                        return true;
                    }
                }).catch(e => {
                    throw new Error(e.message);
                })
                
            }),
            body('phone','Phone number is required').isNumeric()
            .isLength({min:10,max:10}).withMessage('Invalid Phone number')
            .custom((phone,{req})=>{
                return User.findOne({
                    phone:phone
                }).then(user => {
                    if(user){
                        throw new Error('Phone Already Exists');                        
                    }else{
                        return true;
                    }
                }).catch(e => {
                    throw new Error(e.message);
                })
            }),
            body('password','Password is required').isAlphanumeric()
                .isLength({ min:8,max:25 })
                .withMessage('Password must be between 8-20 characters'),
            body('passwordConfirmation',"Password doesn't match.").custom((value, { req }) => {
                return req.body.passwordConfirmation === req.body.password;
            }),
            body('type','User role type is required').isString(),
            body('status','User status is required').isString(),
        ]
    }

    static verifyUserEmail(){
        return [
            body('email','Email is required').isEmail(),
            body('verification_token','Otp is required').isNumeric()
            .isLength({min:6,max:6})
            .withMessage('Valid otp is required'),
        ]
    }

    static verifyUserForResendEmail(){
        return [query('email','Email is required').isEmail()];
    }
}