import {Request,Response} from "express";
import {ClassSession} from "../models/classSessionModel";


// create new session
export const createSession=async(req:Request,res:Response)=>{
    try{
        const {title,timeSlot,capacity}=req.body;
        // auth middleware
        const userId = (req as any).user?.userId || (req as any).user?.id ;

        // create new session
        const newSession=await ClassSession.create({
            title,
            trainer:userId,
            timeSlot,
            capacity,
        });

        // if no errors 
        return res.status(201).json({
            message: "Session created successfully",
            newSession
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
export const getAllSessions = async (req: Request, res: Response) => {
    try {
        const { title, trainer, date, availableOnly } = req.query;

        // Object use for search
        let queryObject: any = { isDeleted: false };

        // Search by title
        if (title) {
            queryObject.title = { $regex: title, $options: 'i' }; // Flexible text Search (Case Insensitive) 
        }

        // Filter by trainer
        if (trainer) {
            queryObject.trainer = trainer; // Trainer Object Id
        }

        // Filter by day / time slot
        if (date) {
            const startDate = new Date(date as string);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1); // add 1 to start date to get end date

            // Time range
            queryObject.timeSlot = {
                $gte: startDate, // greater than or equal
                $lt: endDate // less than
            };
        }

        // get sessions from database
        let sessions = await ClassSession
            .find(queryObject)
            .populate('trainer', 'fullName email');


        // Availability 
        if (availableOnly === 'true') {
            sessions = sessions.filter(session => session.bookedSeats < session.capacity);
        }

        // if no sessions found 
        if (sessions.length === 0) {
            return res.status(200).json({
                message: "No sessions found matching your search",
                count: 0,
                sessions: []
            });
        }

        // return sessions 
        return res.status(200).json({
            count: sessions.length,
            sessions
        });

    }
    // if any error exist
    catch (error) {
        return res.status(500).json({
            error: "Server error while fetching sessions",
        });
    }
}


// get session by id
export const getSessionById=async(req:Request,res:Response)=>{
    try{

        const sessionId=req.params.id;
        // check if user sends the id
        if(!sessionId){
            return res.status(400).json({
                message:"Id are required",
        })  ;     
     }

     // find session
     const session = await ClassSession.findOne({
            _id: sessionId,
            isDeleted: false
        }).populate('trainer', 'fullName email'); 


     //check if session exist
     if(!session){
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


// Delete session (Soft delete)
export const deleteSession=async(req:Request ,res:Response)=>{
    try{

        const sessionId=req.params.id;
        // auth
        const userId = (req as any).user?.userId || (req as any).user?.id ;

        // check if user sends the id
        if(!sessionId){
            return res.status(400).json({
                message:"Id is required",
            });
        }
       
        // find session 
        const session = await ClassSession.findOne({
            _id: sessionId, // condition
            isDeleted: false
        });

        // if session doesn't exist
        if(!session){
            return res.status(404).json({
                message:"Session not found",
            });
        }

        // Business Rule
        if (session.trainer.toString() !== userId) {
            return res.status(403).json({ 
                message: "Forbidden: You are not the owner of this session" 
            });
        }

        // Business Rule
        if (session.bookedSeats > 0) {
            return res.status(400).json({ 
                message: "Cannot delete session with active bookings" 
            });
        }

        // if no errors
        session.isDeleted = true;
        await session.save();

        return res.status(200).json({
            message: "Session deleted successfully"
        });
    }

    // if any error exist
    catch(error){
        return res.status(500).json({
            error: "Server error while deleting session",
        });
    }
}


// update session
export const updateSession=async(req:Request,res:Response)=>{
    try{
        const sessionId=req.params.id;
        const updates=req.body;
        // auth
        const userId = (req as any).user?.userId || (req as any).user?.id ;

        // check if user sends the id
        if(!sessionId){
            return res.status(400).json({
                message:"Id is required",
            });
        }

        // find session
        const session=await ClassSession.findOne({
            _id:sessionId,
            isDeleted:false
        });

        // if session doesn't exist
        if(!session){
            return res.status(404).json({
                message:"Session not found",
            });
        }

        // Ownership check
        if (session.trainer.toString() !== userId) {
            return res.status(403).json({ 
                message: "Forbidden: You are not the owner of this session" 
            });
        }

        // Check capacity limit
        if (updates.capacity && updates.capacity < session.bookedSeats) {
            return res.status(400).json({
                message: `Capacity cannot be less than currently booked seats (${session.bookedSeats})`
            });
        }

        // update session
        const updatedSession=await ClassSession.findByIdAndUpdate(
            sessionId, // id
            updates, // update data
            {new:true} // return updated data
        )

        
        // if no errors
        return res.status(200).json({
            message:"Session updated successfully",
            updatedSession
        });
    }

    // if any error exist
    catch(error){
        return res.status(500).json({
            error: "Server error while updating session",
        });
    }
}