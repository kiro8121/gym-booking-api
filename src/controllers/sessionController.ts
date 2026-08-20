import {Request,Response} from "express";
import {class_session} from "../models/classSession";


// create new session
export const create_session=async(req:Request,res:Response)=>{
    try{
        const {title,time_slot,capacity}=req.body;
        // auth middleware
        const trainer_id = (req as any).user._id;

        // create new session
        const new_session=await class_session.create({
            title,
            trainer:trainer_id,
            time_slot,
            capacity,
        });

        // if no errors 
        return res.status(201).json({
            message: "Session created successfully",
            new_session
        });
    }

    // if any errors exist
    catch(error){
        return res.status(500).json({
            error:"Server error while creating session",
        });
    }
}



// get all sessions
export const get_all_sessions=async (req:Request,res:Response)=>{

    try{

        const sessions = await class_session.find({ is_deleted: false }).populate("trainer", "name");

        return res.status(200).json({
            message:"Sessions retrieved successfully",
            sessions
        });
    }

    // if any errors exist
    catch (error) {

        return res.status(500).json({
            error: "Server error while fetching sessions"
        });
    }
}



// get session by id
export const get_session_by_id=async(req:Request,res:Response)=>{
    try{

        const session_id=req.params.id;
        // check if user sends the id
        if(!session_id){
            return res.status(400).json({
                message:"Id are required",
        })  ;     
     }

     const session = await class_session.findById(session_id).populate("trainer", "name");

     //check if session exist
     if(!session || session.is_deleted){
        return res.status(404).json({
            message:"session not found",
        });
     }

     // if no errors
     return res.status(200).json({
        message: "Session retrieved successfully",
        session
    });
    }

    // if any error exist
    catch(error){
        return res.status(500).json({
            error:"Server error while fetching session",
        });
    }
}


// delete session
