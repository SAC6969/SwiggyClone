import * as mongoose from 'mongoose';
import {model} from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{ type:String, required:true },
    email: { type:String, required:true ,unique:true},
    email_verified: {type:Boolean, required: true, default:false },
    verification_token: {type:Number, required: true},
    verification_token_time: {type: Date, required: true},
    phone: { type:String, required:true ,unique:true},
    password:{ type:String, required:true },
    type:{ type:String, required:true },
    status:{ type:String, required:true },
},{
    timestamps:true
});

export default model('User',userSchema);