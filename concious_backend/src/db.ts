import mongoose, { model, Schema } from "mongoose";
import { MONGO_URI } from "./config.js";

mongoose.connect(MONGO_URI);

const UserSchema = new Schema({
    username:{type:String , unique:true},
    password:String
})

export const UserModel = model('user' , UserSchema);

const ContentSchema = new Schema({
    title:String,
    link:String,
    type:String,
    tags:[{type:mongoose.Types.ObjectId , ref:'Tag'}],
    userId:{type:mongoose.Types.ObjectId , ref:'user', required:true}
})    

export const ContentModel = model('content' , ContentSchema);  

const LinkSchema = new Schema({
    hash:String,
    userId:{type:mongoose.Types.ObjectId , ref:'user' , required:'true'}
})

export const LinkModel = model('link', LinkSchema)
