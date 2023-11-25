import { Schema } from 'mongoose';
import mongoose from 'mongoose';

const appointmentSchema = new Schema(
  {
    time: {
      type: Date,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    counselor: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    booked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('appointments', appointmentSchema);

export default Appointment;
