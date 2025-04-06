import Reservation from "../../../DB/model/reservation.model.js";
import Doctor from "../../../DB/model/doctor.model.js";
import User from "../../../DB/model/User.model.js";
import { reservationSchema } from "../reservation.validation.js";
import mongoose from "mongoose";




export const createReservation = async (doctorId, userId, date, timeSlot) => {
  //  Validate request data with Joi
  const { error } = reservationSchema.validate({ doctorId, userId, date, timeSlot });
  if (error) {
    throw new Error(error.details[0].message);
  }

  //  Check if doctor exists
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor not found");

  //  Check if user exists
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  //  Convert date to match stored format
  const formattedDate = new Date(date).toISOString().split('T')[0];

  //  Find schedule for the given date
  const scheduleEntry = doctor.schedule.find(entry =>
    entry.date.toISOString().split('T')[0] === formattedDate
  );

  if (!scheduleEntry) throw new Error("No schedule available for this date");

  //  Check if the time slot is available in the doctor's schedule
  if (!scheduleEntry.timeSlots.includes(timeSlot)) {
    throw new Error("Time slot not available");
  }

  //  Check if the time slot is already booked
  const existingReservation = await Reservation.findOne({ doctor: doctorId, date, timeSlot });
  if (existingReservation) {
    throw new Error("This time slot is already booked. Please choose another slot.");
  }

  //  Remove the booked slot from the doctor's schedule
  scheduleEntry.timeSlots = scheduleEntry.timeSlots.filter(slot => slot !== timeSlot);
  await doctor.save(); // Save updated doctor schedule

  //  Create and save the reservation
  const reservation = await Reservation.create({
    doctor: doctorId,
    user: userId,
    date,
    timeSlot
  });

  // Update doctor's reservations list
  doctor.reservations.push(reservation._id);
  await doctor.save();

  //  Update user's reservations list
  user.reservations.push(reservation._id);
  await user.save();

  return reservation;
};



//cancel reservation 

export const cancelReservation = async (req, res) => {
  try {
      let { reservationId } = req.params;
      reservationId = reservationId.trim(); // Remove unwanted spaces

      console.log("Checking reservationId:", reservationId);

      // Convert to ObjectId explicitly
      if (!mongoose.isValidObjectId(reservationId)) {
          return res.status(400).json({ message: "Invalid reservation ID format" });
      }

      // Find the reservation
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
          return res.status(404).json({ message: "Reservation not found" });
      }

      // Ensure user owns the reservation
      if (reservation.user.toString() !== req.user._id.toString())
        {
          return res.status(403).json({ message: "Unauthorized: You can only cancel your own reservations" });
      }

      // Prevent cancellation if past appointment date
      if (new Date(reservation.date) < new Date()) {
          return res.status(400).json({ message: "Cannot cancel past reservations" });
      }

      // Update reservation status
      reservation.status = "Cancelled";
      await reservation.save();

      return res.status(200).json({ message: "Reservation cancelled successfully", reservation });
  } catch (error) {
      console.error("Error in cancelReservation:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
  }
};

