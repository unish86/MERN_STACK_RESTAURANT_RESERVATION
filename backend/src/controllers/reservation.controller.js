import { Reservation } from "../models/reservation.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendReservationStatusEmail } from "../services/mail.service.js";

export const createReservation = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, date, time } = req.body;

  if (!firstName || !lastName || !email || !phone || !date || !time) {
    throw new ApiError(400, "Please fill the complete reservation form");
  }

  const reservationDate = new Date(date);

  if (Number.isNaN(reservationDate.getTime())) {
    throw new ApiError(400, "Please provide a valid reservation date");
  }

  const reservation = await Reservation.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    phone: String(phone).trim(),
    date: reservationDate,
    time
  });

  res.status(201).json({
    success: true,
    message: "Reservation submitted successfully",
    reservation
  });
});

export const getReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reservations.length,
    reservations
  });
});

export const updateReservationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowedStatuses = ["approved", "cancelled"];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Status must be approved or cancelled");
  }

  const reservation = await Reservation.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

  let emailSent = false;
  let emailError = "";

  try {
    emailSent = await sendReservationStatusEmail(reservation);
  } catch (error) {
    emailError = error.message;
    console.error(`Reservation email failed: ${error.message}`);
  }

  res.status(200).json({
    success: true,
    message: emailSent
      ? `Reservation ${status} successfully and email sent to customer`
      : `Reservation ${status} successfully, but email could not be sent`,
    emailSent,
    emailError,
    reservation
  });
});
