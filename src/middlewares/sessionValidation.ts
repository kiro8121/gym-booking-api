import {Request ,Response, NextFunction} from "express";

export const validate_create_session=(req:Request,res:Response,next:NextFunction)=>{
   try{

    const {title , time_slot,capacity}=req.body;

    // Required fields validation
    if(!title||!time_slot||!capacity||typeof title !== 'string' || title.trim() === ''){
        return res.status(400).json({
            message:"Missing required fields",
        });
    }

    // Capacity validation
    if(typeof capacity!== "number"|| capacity<=0||!Number.isInteger(capacity)){
        return res.status(400).json({
            message:"Capacity must be a positive integer",
        });
    }

    // Time slot validation 
    const input_date = new Date(time_slot);
    const current_date = new Date();

    if(isNaN(input_date.getTime())||input_date <= current_date){
        return res.status(400).json({
            message:"Time slot must be a valid future date and time."
        });
    }
    // if no errors
    next();
}

// If any errors exist 
    catch(error){

        return res.status(500).json({
            error:"Server error",
        });
    }
}
// end of create session validation


// update session validation
export const validate_update_session=(req:Request,res:Response,next:NextFunction)=>{
    try{

        const {title,time_slot,capacity}=req.body;

        // Required fields validation
        if(!title&&!time_slot&&capacity===undefined){
            return res.status(400).json({
                message:"At least one field is required to update",
            });
        }

        // capacity validation
        if(capacity!==undefined){
            if(typeof capacity !=='number'||capacity <= 0 || !Number.isInteger(capacity)){
                return res.status(400).json({
                    message:"Capacity must be a positive integer",
                });
            }
        }

        // time slot validation
        if(time_slot!==undefined){

            const input_date = new Date(time_slot);
            const current_date = new Date();

            if(isNaN(input_date.getTime())||input_date <= current_date){
                return res.status(400).json({
                    message:"Time slot must be a valid future date and time."
                });
            }
        }
        // if no errors
        next();
    }

    // If any errors exist 
    catch(error){
        return res.status(500).json({
            error:"Server error",
        });
    }
}