import {Schema , model } from "mongoose";
//bia5d schema mn el mongoose

const user_Schema = new Schema({
    full_Name: {
        type :String,
        required:true
    },

    //yrfd 2y 7sab gded bemail mogod
    email: {
        type :String,
        required:true ,
         unique:true
    },
        
    //  hashed password 7maia w kda shofony b7meko mn el hackers
    hass_password: {
        type :String,
        required:true
    },
    
    role: {
        type: String,
        enum: ['Member', 'Trainer'],
        default: 'Member'
    },

    // tare5 ansha2 el 7sab
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
    
});

export default model('User', user_Schema);


