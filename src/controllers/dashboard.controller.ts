import { Request, Response } from "express";
import User from "../models/model_user";
import { class_session } from "../models/classSession";
import booking from "../models/model.Booking";

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalMembers = await User.countDocuments({
            role: "Member"
        });

        const totalTrainers = await User.countDocuments({
            role: "Trainer"
        });

        const totalSessions = await class_session.countDocuments({
            is_deleted: false
        });

        const totalBookings = await booking.countDocuments({
            status: "booked"
        });
        const busiestClass = await booking.aggregate([
            {
                $match: {
                    status: "booked"
                }
            },
            {
                $group: {
                    _id: "$session",
                    bookings: { $sum: 1 }
                }
            },
            {
                $sort: {
                    bookings: -1
                }
            },
            {
                $limit: 1
            },
            {
                $lookup: {
                    from: "class_sessions",
                    localField: "_id",
                    foreignField: "_id",
                    as: "session"
                }
            },
            {
                $unwind: "$session"
            },
            {
                $project: {
                    _id: 0,
                    title: "$session.title",
                    bookings: 1
                }
            }
        ]);

        return res.status(200).json({
            totalMembers,
            totalTrainers,
            totalSessions,
            totalBookings,
            busiestClass: busiestClass[0] || null
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        return res.status(500).json({
            error: "Server error while fetching dashboard statistics"
        });
    }
};