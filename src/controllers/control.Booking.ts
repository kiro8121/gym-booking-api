import { Response } from 'express';
import booking from '../models/model.Booking';
import { class_session } from '../models/classSession';
import { Authent_Request } from '../middlewares/auth_auth_middleware'; // استيراد نوع الطلب المُعدل

export const getAllClasses = async (req: Authent_Request, res: Response) => {
  try {
    const { title, trainer, date, availableOnly } = req.query;

    let query_object: any = { is_deleted: false };

    if (title) {
        query_object.title = { $regex: title, $options: 'i' }; 
    }

    if (trainer) {
        query_object.trainer = trainer; 
    }

    if (date) {
        const start_date = new Date(date as string);
        const end_date = new Date(start_date);
        end_date.setDate(end_date.getDate() + 1); 

        query_object.time_slot = {
            $gte: start_date, 
            $lt: end_date 
        };
    }

    let sessions = await class_session
        .find(query_object)
        .populate('trainer', 'full_Name email');

    if (availableOnly === 'true') {
        sessions = sessions.filter(session => session.booked_seats < session.capacity);
    }

    if (sessions.length === 0) {
        return res.status(200).json({
            message: "No sessions found matching your search",
            count: 0,
            sessions: []
        });
    }

    return res.status(200).json({
        count: sessions.length,
        sessions
    });

  } catch (error) {
      return res.status(500).json({
          error: "Server error while fetching sessions",
      });
  }
};

export const getMyBookings = async (req: Authent_Request, res: Response) => {
  try {
    // بناخد الـ ID من الـ Token مباشرة للأمان التام
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
    // بناخد الـ ID من الـ Token مباشرة بدل ما اليوزر يبعته في الـ body
    const memberId = req.user?.userId;

    const session = await class_session.findById(classId);
    if (!session) return res.status(404).json({ error: "Session Not Found" });

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

    session.booked_seats = currentBookings + 1;
    await session.save();

    return res.status(201).json({ newBooking });

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return res.status(400).json({ error: errorMessage });
  }
};

export const cancelBooking = async (req: Authent_Request, res: Response) => {
  try {
    const { Id } = req.params;

    const targetBooking = await booking.findById(Id);
    if (!targetBooking) return res.status(404).json({ error: "Booking not found" });

    if (targetBooking.status === 'cancelled') {
      return res.status(400).json({ error: "Booking is already cancelled" });
    }

    targetBooking.status = 'cancelled';
    await targetBooking.save();

    await class_session.findByIdAndUpdate(targetBooking.session, {
      $inc: { booked_seats: -1 } 
    });

    return res.status(200).json({ message: "Booking cancelled successfully", targetBooking });

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return res.status(400).json({ error: errorMessage });
  }
};