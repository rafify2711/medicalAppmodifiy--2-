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


export const getDoctorReservations = async (doctorId) => {
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    throw new Error("Invalid doctor ID format");
  }

  const reservations = await Reservation.find({ doctor: doctorId })
    .populate("doctor", "name specialization")
    .populate("user", "username email");

  if (!reservations.length) {
    throw new Error("No reservations found for this doctor");
  }

  return reservations;
};
