import {Schema , model } from "mongoose";

// user schema
const userSchema = new Schema({
    fullName: {
        type :String,
        required:true

    },

    email: {
        type :String,
        required:true ,
         unique:true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
        
    password: {
        type :String,
        required:true
    },
    
    role: {
        type: String,
        enum: ['Member', 'Trainer'],
        default: 'Member'
    },

    createdAt: { 
        type: Date, 
        default: Date.now 
    }
    
});

export default model('User', userSchema);