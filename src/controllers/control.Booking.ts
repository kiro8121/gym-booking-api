import {Request , Response } from 'express';
import booking from '../models/model.Booking';
import { class_session } from '../models/classSession';
import { Authent_Request } from '../middlewares/auth_auth_middleware'; 

export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const classes = await class_session.find();
    return res.status(200).json({ classes });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return res.status(400).json({ error: errorMessage });
  }
};
export const getMyBookings = async (req: Authent_Request, res: Response) => {
  try {
    const memberId = req.user?.userId;

    const bookings = await booking.find({ member: memberId }).populate('session');
    return res.status(200).json({ bookings });

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return res.status(400).json({ error: errorMessage });
  }
};






export const createBooking = async (req: Authent_Request, res: Response) => {
  try {
    const { classId } = req.body;
    const memberId = req.user?.userId;

    const session = await class_session.findOne({ _id: classId, is_deleted: false });
    if (!session) return res.status(404).json({ error: "Session Not Found or Deleted" });

    if (new Date(session.time_slot) <= new Date()) {
      return res.status(400).json({ error: "Cannot book a past session" });
    }

    const existingBooking = await booking.findOne({ 
      session: classId, 
      member: memberId, 
      status: 'booked' 
    });
    if (existingBooking) {
      return res.status(400).json({ error: "You have already booked this session" });
    }

    const currentBookings = await booking.countDocuments({ session: classId, status: 'booked' });
    if (currentBookings >= session.capacity) {
      return res.status(400).json({ error: "Session completed / fully booked" });
    }

    const newBooking = await booking.create({ session: classId, member: memberId });

    await class_session.findByIdAndUpdate(classId, {
      $inc: { booked_seats: 1 }
    });

    return res.status(201).json({ newBooking });

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return res.status(400).json({ error: errorMessage });
  }
};




export const cancelBooking = async (req: Authent_Request, res: Response) => {
  try {
    const { Id } = req.params;
    const memberId = req.user?.userId;

    const targetBooking = await booking.findOne({
      _id: Id,
      member: memberId
    });

    if (!targetBooking) {
      return res.status(404).json({
        error: "Booking not found"
      });
    }

    if (targetBooking.status === 'cancelled') {
      return res.status(400).json({
        error: "Booking is already cancelled"
      });
    }

    targetBooking.status = 'cancelled';
    await targetBooking.save();

    await class_session.findByIdAndUpdate(targetBooking.session, {
      $inc: { booked_seats: -1 }
    });

    return res.status(200).json({
      message: "Booking cancelled successfully",
      targetBooking
    });

  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "An unknown error occurred";

    return res.status(400).json({
      error: errorMessage
    });
  }
};