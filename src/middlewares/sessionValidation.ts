import {Request ,Response, NextFunction} from "express";

export const validateCreateSession=(req:Request,res:Response,next:NextFunction)=>{
   try{

    const {title , timeSlot,capacity}=req.body;

    // Required fields validation
    if(!title||!timeSlot||!capacity||typeof title !== 'string' || title.trim() === ''){
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
    const inputDate = new Date(timeSlot);
    const currentDate = new Date();

    if(isNaN(inputDate.getTime())||inputDate <= currentDate){
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
export const validateUpdateSession=(req:Request,res:Response,next:NextFunction)=>{
    try{

        const {title,timeSlot,capacity}=req.body;

        // Required fields validation
        if(!title&&!timeSlot&&capacity===undefined){
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
        if(timeSlot!==undefined){

            const inputDate = new Date(timeSlot);
            const currentDate = new Date();

            if(isNaN(inputDate.getTime())||inputDate <= currentDate){
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