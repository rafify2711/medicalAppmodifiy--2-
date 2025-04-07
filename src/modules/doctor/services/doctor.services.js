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
 
// this function can add new date and new slots and check if the date is already exist and the timeslot and if there is additional timeslot for specific date it add it  
export const addToSchedule = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { schedule } = req.body;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    if (!Array.isArray(schedule) || !schedule.length) {
      return res.status(400).json({ message: "Schedule must be a non-empty array" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    let updated = false;
    const addedDates = [];
    const updatedDates = [];

    for (const newEntry of schedule) {
      const newEntryDate = new Date(newEntry.date).setHours(0, 0, 0, 0);

      const existingDateIndex = doctor.schedule.findIndex(entry => {
        const existingDate = new Date(entry.date).setHours(0, 0, 0, 0);
        return existingDate === newEntryDate;
      });

      if (existingDateIndex !== -1) {
        const existingSlots = doctor.schedule[existingDateIndex].timeSlots;
        let newSlotsAdded = false;

        newEntry.timeSlots.forEach(slot => {
          if (!existingSlots.includes(slot)) {
            existingSlots.push(slot);
            newSlotsAdded = true;
          }
        });

        if (newSlotsAdded) {
          doctor.schedule[existingDateIndex].timeSlots = existingSlots;
          updated = true;
          updatedDates.push(newEntry.date);
        }
      } else {
        doctor.schedule.push(newEntry);
        updated = true;
        addedDates.push(newEntry.date);
      }
    }

    if (!updated) {
      return res.status(400).json({ message: "All provided dates and time slots already exist in the schedule." });
    }

    await doctor.save();

    return res.status(200).json({
      message: "Schedule updated successfully",
      addedDates,
      updatedDates,
      schedule: doctor.schedule,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// delete date or delete specific timeslot from a date

export const deleteFromSchedule = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date, timeSlot } = req.body;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const inputDate = new Date(date).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    if (inputDate < today) {
      return res.status(400).json({ message: "Cannot modify a past date in the schedule." });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const scheduleIndex = doctor.schedule.findIndex(entry => {
      const entryDate = new Date(entry.date).setHours(0, 0, 0, 0);
      return entryDate === inputDate;
    });

    if (scheduleIndex === -1) {
      return res.status(404).json({ message: "Date not found in schedule" });
    }

    // If timeSlot is provided, delete it; otherwise delete the whole date
    if (timeSlot) {
      const timeSlots = doctor.schedule[scheduleIndex].timeSlots;
      const slotIndex = timeSlots.indexOf(timeSlot);

      if (slotIndex === -1) {
        return res.status(404).json({ message: "Time slot not found for the given date" });
      }

      timeSlots.splice(slotIndex, 1);

      // Remove the entire date if no time slots left
      if (timeSlots.length === 0) {
        doctor.schedule.splice(scheduleIndex, 1);
      }

      await doctor.save();
      return res.status(200).json({
        message: `Time slot '${timeSlot}' deleted from date '${date}'`,
        schedule: doctor.schedule
      });
    } else {
      // Delete the whole date
      doctor.schedule.splice(scheduleIndex, 1);
      await doctor.save();
      return res.status(200).json({
        message: `Schedule date '${date}' deleted successfully`,
        schedule: doctor.schedule
      });
    }

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



 


//get doctor's reservations 
export const getDoctorReservations = async (req , res ) => {
 try{ 
  const  { doctorId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    throw new Error("Invalid doctor ID format");
  }

  const reservations = await Reservation.find({ doctor: doctorId })
    .populate("doctor", "username specialty")
    .populate("user", "username email");

  if (!reservations.length) {
    throw new Error("No reservations found for this doctor");
  }

// Modify response to include doctor details directly
const formattedReservations = reservations.map(reservation => ({
  id: reservation._id,
  date: reservation.date,
  timeSlot:reservation.timeSlot,
  status: reservation.status,
  doctor: {
      id: reservation.doctor._id,
      name: reservation.doctor.username,
      specialization: reservation.doctor.specialty
  },
  user: {
      id: reservation.user._id,
      username: reservation.user.username,
      email: reservation.user.email
  }
}));

return res.status(200).json({ 
  message: "Reservations fetched successfully", 
  reservations: formattedReservations
});

} catch (error) {
return res.status(500).json({ message: "Server error", error: error.message });
}
};
