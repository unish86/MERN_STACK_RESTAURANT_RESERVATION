import mongoose from "mongoose";
import validator from "validator";

const reservationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [40, "First name cannot exceed 40 characters"]
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [40, "Last name cannot exceed 40 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"]
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator(value) {
          return /^[0-9]{10,15}$/.test(value);
        },
        message: "Phone number must be 10 to 15 digits"
      }
    },
    date: {
      type: Date,
      required: [true, "Reservation date is required"]
    },
    time: {
      type: String,
      required: [true, "Reservation time is required"],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Please provide a valid time"]
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export const Reservation = mongoose.model("Reservation", reservationSchema);
