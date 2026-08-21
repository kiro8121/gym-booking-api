import {Router} from 'express';

import {createBooking, cancelBooking, getMyBookings, getAllClasses} from '../controllers/control.Booking';

import {validateBookingData} from "../middlewares/validateBookingData"
import { authenticate, authorize } from '../middlewares/auth_auth_middleware';


const router = Router();



router.get('/search',getAllClasses);

router.get('/mybooking',authenticate,authorize("Member","member"),getMyBookings);

router.post('/booking',authenticate,authorize("Member","member"),validateBookingData,createBooking);

router.patch('/booking/:Id',authenticate,authorize("Member","member"),cancelBooking);







export default router; 

