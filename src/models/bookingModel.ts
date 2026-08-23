import mongoose, { Schema, model } from 'mongoose';

const bookingSchema: Schema = new Schema({

  session: {
    type: Schema.Types.ObjectId,
    ref: 'ClassSession',
    required: true
  },

  member: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  status: {
    type: String,
    enum: ['booked', 'cancelled'],
    default: 'booked'
  }
},
{ timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;