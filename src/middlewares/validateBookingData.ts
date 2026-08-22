import { Request, Response, NextFunction } from 'express';



export const validateBookingData = (req: Request, res: Response, next: NextFunction) => {

  try {

    const { classId } = req.body;



    if (!classId ) {

      return res.status(400).json({ error: "you must write classe id and member id" });

    }



    next();



  } catch (e) {

    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";

    return res.status(400).json({ error: errorMessage });

  }

};



export default validateBookingData; 

