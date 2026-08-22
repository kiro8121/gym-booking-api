import {Request,Response} from "express";
import {class_session} from "../models/classSession";


// create new session
export const create_session=async(req:Request,res:Response)=>{
    try{
        const {title,time_slot,capacity}=req.body;
        // auth middleware
        const user_id = (req as any).user?.userId || (req as any).user?.id ;

        // create new session
        const new_session=await class_session.create({
            title,
            trainer:user_id,
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
export const get_all_sessions = async (req: Request, res: Response) => {
    try {
        const { title, trainer, date, availableOnly } = req.query;

        // Object use for search
        let query_object: any = { is_deleted: false };

        // Search by title
        if (title) {
            query_object.title = { $regex: title, $options: 'i' }; // Flexible text Search (Case Insensitive) 
        }

        // Filter by trainer
        if (trainer) {
            query_object.trainer = trainer; // Trainer Object Id
        }

        // Filter by day / time slot
        if (date) {
            const start_date = new Date(date as string);
            const end_date = new Date(start_date);
            end_date.setDate(end_date.getDate() + 1); // add 1 to start date to get end date

            // Time range
            query_object.time_slot = {
                $gte: start_date, // greater than or equal
                $lt: end_date // less than
            };
        }

        // get sessions from database
        let sessions = await class_session
            .find(query_object)
            .populate('trainer', 'full_Name email');


        // Availability 
        if (availableOnly === 'true') {
            sessions = sessions.filter(session => session.booked_seats < session.capacity);
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
export const get_session_by_id=async(req:Request,res:Response)=>{
    try{

        const session_id=req.params.id;
        // check if user sends the id
        if(!session_id){
            return res.status(400).json({
                message:"Id are required",
        })  ;     
     }

     // find session
     const session = await class_session.findOne({
            _id: session_id,
            is_deleted: false
        }).populate('trainer', 'full_Name email'); 


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
export const delete_session=async(req:Request ,res:Response)=>{
    try{

        const session_id=req.params.id;
        // auth
        const user_id = (req as any).user?.userId || (req as any).user?.id ;

        // check if user sends the id
        if(!session_id){
            return res.status(400).json({
                message:"Id is required",
            });
        }
       
        // find session 
        const session = await class_session.findOne({
            _id: session_id, // condition
            is_deleted: false
        });

        // if session doesn't exist
        if(!session){
            return res.status(404).json({
                message:"Session not found",
            });
        }

        // Business Rule
        if (session.trainer.toString() !== user_id) {
            return res.status(403).json({ 
                message: "Forbidden: You are not the owner of this session" 
            });
        }

        // Business Rule
        if (session.booked_seats > 0) {
            return res.status(400).json({ 
                message: "Cannot delete session with active bookings" 
            });
        }

        // if no errors
        session.is_deleted = true;
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
export const update_session=async(req:Request,res:Response)=>{
    try{
        const session_id=req.params.id;
        const updates=req.body;
        // auth
        const user_id = (req as any).user?.userId || (req as any).user?.id ;

        // check if user sends the id
        if(!session_id){
            return res.status(400).json({
                message:"Id is required",
            });
        }

        // find session
        const session=await class_session.findOne({
            _id:session_id,
            is_deleted:false
        });

        // if session doesn't exist
        if(!session){
            return res.status(404).json({
                message:"Session not found",
            });
        }

        // Ownership check
        if (session.trainer.toString() !== user_id) {
            return res.status(403).json({ 
                message: "Forbidden: You are not the owner of this session" 
            });
        }

        // Check capacity limit
        if (updates.capacity && updates.capacity < session.booked_seats) {
            return res.status(400).json({
                message: `Capacity cannot be less than currently booked seats (${session.booked_seats})`
            });
        }

        // update session
        const updated_session=await class_session.findByIdAndUpdate(
            session_id, // id
            updates, // update data
            {new:true} // return updated data
        )

        
        // if no errors
        return res.status(200).json({
            message:"Session updated successfully",
            updated_session
        });
    }

    // if any error exist
    catch(error){
        return res.status(500).json({
            error: "Server error while updating session",
        });
    }
}


