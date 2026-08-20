import {Schema , model } from "mongoose";
//bia5d schema mn el mongoose
const user_Schema = new Schema({
    full_Name: {Type :String,required:true},

    email: {Type :String,required:true , unique:true},//yrfd 2y 7sab gded bemail mogod

    hass_password: {Type :String,required:true},
    //  hashed password 7maia w kda shofony b7meko mn el hackers

    role: {
        type: String,
        enum: ['Member', 'Trainer'],
        default: 'Member'
    },

    createdAt: { type: Date, default: Date.now }
    // tare5 ansha2 el 7sab

});

export default model('User', user_Schema);


