import joi from "joi"



export const reservationSchema = joi.object({
    userId: joi.string().required(), // Ensure userId is provided
    doctorId: joi.string().required(), // Ensure doctorId is provided
    date: joi.date().required(), // Ensure valid date
    timeSlot: joi.string().required() // Ensure timeSlot is provided
  });