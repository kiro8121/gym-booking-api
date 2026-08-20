import mongoose from "mongoose";
import {Schema,model} from "mongoose";

// create schema
export const class_session_schema= new Schema({
    title:{
        type:String,
        required:true,
    },
    trainer:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    time_slot:{
        type:Date,
        required:true,
    },
    capacity:{
        type:Number,
        required:true,
        min:1,
    },
    // zyada
    booked_seats:{
        type:Number,
        default:0,
    }
},
// Automatically adds createdAt and updatedAt fields
{
    timestamps: true 
}
);

// create model
export const class_session=mongoose.model("class_session",class_session_schema);