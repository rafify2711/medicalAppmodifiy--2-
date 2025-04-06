import express from "express";
import * as doctorService from "./services/doctor.services.js";
import { authentication, authorization } from "../../middleware/auth.middleware.js";

const router = express.Router();



/**
 * @route   GET /api/doctor/:id
 * @desc    Get a doctor by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/doctor/:id
 * @desc    Update doctor details
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedDoctor = await doctorService.updateDoctor(req.params.id, req.body);
    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json({ message: "Doctor updated successfully", updatedDoctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/doctor/:id
 * @desc    Delete a doctor
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedDoctor = await doctorService.deleteDoctor(req.params.id);
    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/doctor/:doctorId/schedule
 * @desc    Update doctor's schedule
 */
router.put(
  "/:doctorId/schedule",
  authentication(),
  authorization(["Doctor"]),
  async (req, res) => {
    try {
      const updatedSchedule = await doctorService.updateSchedule(req.params.doctorId, req.body);
      res.json({ message: "Schedule updated successfully", updatedSchedule });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * @route   GET /api/doctor/:doctorId/available-slots/:date
 * @desc    Fetch available slots for a doctor on a specific date
 */
router.get("/:doctorId/available-slots/:date", async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    const availableSlots = await doctorService.getDoctorAvailableSlots(doctorId, date);
    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/doctor/:doctorId/reservations
 * @desc    Get reservations for a specific doctor
 */
router.get("/:doctorId/reservations", async (req, res) => {
  try {
    const reservations = await doctorService.getDoctorReservations(req.params.doctorId);
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await doctorService.getAllDoctors();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
