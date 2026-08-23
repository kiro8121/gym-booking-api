import {Router} from 'express';

import {createBooking, cancelBooking, getMyBookings, getAllClasses} from '../controllers/bookingController';

import {validateBookingData} from "../middlewares/bookingValidation"
import { authenticate, authorize } from '../middlewares/authMiddleware';


const router = Router();

 /**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Get all class sessions
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of all class sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 classes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 68a123456789abcdef123456
 *                       title:
 *                         type: string
 *                         example: Yoga
 *                       trainer:
 *                         type: string
 *                         example: 68a123456789abcdef123456
 *                       time_slot:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-09-01T18:00:00Z
 *                       capacity:
 *                         type: integer
 *                         example: 20
 *                       booked_seats:
 *                         type: integer
 *                         example: 12
 *       400:
 *         description: Error while fetching class sessions
 */
router.get('/search',getAllClasses);

/**
 * @swagger
 * /api/mybooking:
 *   get:
 *     summary: Get the current member's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Member bookings retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only members can access their bookings
 *       400:
 *         description: Error while fetching bookings
 */
router.get('/mybooking',authenticate,authorize("Member","member"),getMyBookings);

/**
 * @swagger
 * /api/booking:
 *   post:
 *     summary: Book a spot in a class session
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *             properties:
 *               classId:
 *                 type: string
 *                 description: ID of the class session to book
 *                 example: 66d123456789abcdef123456
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid data,or session is fully booked, or member already booked this session
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only members can create bookings
 *       404:
 *         description: Session not found
 */
router.post('/booking',authenticate,authorize("Member","member"),validateBookingData,createBooking);

/**
 * @swagger
 * /api/booking/{Id}:
 *   patch:
 *     summary: Cancel the current member's booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: Id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Booking is already cancelled or request error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only members can cancel bookings
 *       404:
 *         description: Booking not found or booking does not belong to the current member
 */
router.patch('/booking/:Id',authenticate,authorize("Member","member"),cancelBooking);

export default router;