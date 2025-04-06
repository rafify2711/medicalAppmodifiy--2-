// import { Router } from 'express'
// import { createReservation, getUserReservations, getDoctorReservations } from './services/reservation.services.js';

// const router = Router();


// router.post('/', createReservation);
// router.get('/user/:id', getUserReservations);
// router.get('/doctor/:id', getDoctorReservations);

// export default router 

import express from "express";
import * as reservationService from "./services/reservation.services.js";
import { authentication, authorization, roleTypes } from "../../middleware/auth.middleware.js";
import { endpoint } from "../user/user.endpoint.js";



const router = express.Router();

//  Create a new reservation
router.post("/", async (req, res) => {
  try {
    const { doctorId, userId, date, timeSlot } = req.body;

    const reservation = await reservationService.createReservation(doctorId, userId, date, timeSlot);
    res.status(201).json({ message: "Reservation created successfully", reservation });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//cancel reservation 

router.put("/cancel/:reservationId", authentication(),authorization(endpoint.profile), reservationService.cancelReservation); // Protect the route



export default router;
