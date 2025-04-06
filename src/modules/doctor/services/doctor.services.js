import Doctor from "../../../DB/model/doctor.model.js";
import Reservation from "../../../DB/model/reservation.model.js";
import mongoose from "mongoose";


// Fetch doctor profile
export const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).send('Doctor not found');
        }
        res.render('doctorProfile', { doctor });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};


/////////////////////
export const getDoctorAvailableSlots = async (doctorId, date) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor not found");

  const formattedDate = new Date(date).toISOString().split('T')[0];

  const scheduleEntry = doctor.schedule.find(entry =>
    entry.date.toISOString().split('T')[0] === formattedDate
  );

  if (!scheduleEntry) throw new Error("No schedule available for this date");

  return scheduleEntry.timeSlots;
};

// Get all doctors
export const getAllDoctors = async () => {
  return await Doctor.find();
};

// Get a doctor by ID
export const getDoctorById = async (doctorId) => {
  return await Doctor.findById(doctorId).populate("reservations");
};

// Update a doctor's details
export const updateDoctor = async (doctorId, updateData) => {
  return await Doctor.findByIdAndUpdate(doctorId, updateData, { new: true, runValidators: true });
};

// Delete a doctor
export const deleteDoctor = async (doctorId) => {
  return await Doctor.findByIdAndDelete(doctorId);
};
 

//update doctor's schedule
export const updateSchedule = async (doctorId, { schedule }) => {
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    throw new Error("Invalid doctor ID");
  }

  if (!schedule || !Array.isArray(schedule)) {
    throw new Error("Schedule must be an array");
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new Error("Doctor not found");
  }

  doctor.schedule = schedule;
  await doctor.save();

  return doctor;
};

//get doctor's reservations 


export const getDoctorReservations = async (req, res) => {
  try {
      const { doctorId } = req.params;

      // Validate doctorId
      if (!mongoose.Types.ObjectId.isValid(doctorId)) {
          return res.status(400).json({ message: "Invalid doctor ID format" });
      }

      // Fetch all reservations for the given doctor
      const reservations = await Reservation.find({ doctor: doctorId })
          .populate("doctor", "name specialization") // Populate doctor details
          .populate("user", "username email"); // Populate user details

      if (!reservations.length) {
          return res.status(404).json({ message: "No reservations found for this doctor" });
      }

      return res.status(200).json({ message: "Reservations fetched successfully", reservations });
  } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
  }
};