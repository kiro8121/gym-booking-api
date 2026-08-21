import {Router} from 'express';

import {createBooking, cancelBooking, getMyBookings, getAllClasses} from '../controllers/control.Booking';

import {validateBookingData} from "../middlewares/validateBookingData"
import { authenticate, authorize } from '../middlewares/auth_auth_middleware';


const router = Router();


/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search and filter available class sessions
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search sessions by class title
 *
 *       - in: query
 *         name: trainer
 *         schema:
 *           type: string
 *         description: Filter sessions by trainer ID
 *
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter sessions by date
 *
 *       - in: query
 *         name: availableOnly
 *         schema:
 *           type: boolean
 *         description: Return only sessions with available spots
 *
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 *       500:
 *         description: Server error while fetching sessions
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

