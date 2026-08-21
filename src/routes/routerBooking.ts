import {Router} from 'express';

import {createBooking, cancelBooking, getMyBookings, getAllClasses} from '../controllers/control.Booking';

import {validateBookingData} from "../middlewares/validateBookingData"



const router = Router();



router.get('/search',getAllClasses);

router.get('/mybooking',getMyBookings);

router.post('/booking',validateBookingData,createBooking);

router.patch('/booking/:Id',cancelBooking);







export default router; 

