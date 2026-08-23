import mongoose, { Schema, Document } from "mongoose";


// Interface Class Session Schema
export interface IClassSession extends Document {
  title: string;
  trainer: mongoose.Types.ObjectId;
  timeSlot: Date;
  capacity: number;
  bookedSeats: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Class Session Schema Definition
const classSessionSchema = new Schema<IClassSession>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    trainer: {
      type: Schema.Types.ObjectId,
      ref: "User", // References the User model (Trainer)
      required: true,
    },
    timeSlot: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min:1,
    },
    bookedSeats: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Exporting the Mongoose Model
export const ClassSession = mongoose.model<IClassSession>("ClassSession", classSessionSchema);