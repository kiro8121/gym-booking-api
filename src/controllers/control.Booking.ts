import { Request, Response } from 'express';

import booking from '../models/model.Booking';

import {class_session} from '../models/classSession';



export const getAllClasses = async (req: Request, res: Response) => {

  try {

    const classes = await class_session.find();

    return res.status(200).json({ classes });

  } catch (e) {

    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";

    console.log("Validation error:", errorMessage);

    return res.status(400).json({ error: errorMessage });

  }

};



export const getMyBookings = async (req: Request, res: Response) => {

  try {

    const { memberId } = req.query;

   

    const bookings = await booking.find({ member: memberId }).populate('session');

    return res.status(200).json({ bookings });

  } catch (e) {

    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";

    console.log("Validation error:", errorMessage);

    return res.status(400).json({ error: errorMessage });

  }

};



export const createBooking = async (req: Request, res: Response) => {

  try {

    const { classId, memberId } = req.body;



    const session = await class_session.findById(classId);

    if (!session) return res.status(404).json({ error: "Session Not Found " });



    const currentBookings = await booking.countDocuments({ session: classId, status: 'booked' });

    if (currentBookings >= session.capacity) return res.status(400).json({ error: "session completed " });



    const newBooking = await booking.create({ session: classId, member: memberId });

    return res.status(201).json({ newBooking });



  } catch (e) {

    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";

    console.log("Validation error:", errorMessage);

    return res.status(400).json({ error: errorMessage });

  }

};



export const cancelBooking = async (req: Request, res: Response) => {

  try {

    const { Id } = req.params;



    const Booking = await booking.findByIdAndUpdate(Id, { status: 'cancelled' }, { new: true });

    if (!Booking) return res.status(404).json({ error: "booking not found" });



    return res.status(200).json({ Booking });

  } catch (e) {

    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";

    console.log("Validation error:", errorMessage);

    return res.status(400).json({ error: errorMessage });

  }

}; 

