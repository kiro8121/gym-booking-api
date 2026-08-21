import mongoose, {Schema,model} from 'mongoose';





const BookingSchema: Schema = new Schema({

  session: {

    type: Schema.Types.ObjectId,

    ref: 'class_session',

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

}, { timestamps: true });



const booking = mongoose.model('booking',BookingSchema);

export default booking; 

