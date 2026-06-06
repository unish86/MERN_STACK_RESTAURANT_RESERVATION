import { Reservation } from "../models/reservation.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

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
    firstName,
    lastName,
    email,
    phone: String(phone),
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

  res.status(200).json({
    success: true,
    message: `Reservation ${status} successfully`,
    reservation
  });
});
