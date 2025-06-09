import joi from "joi"
import {generalFields } from '../../middleware/validation.middleware.js'
// import { Types } from "mongoose"

export const updateProfile = {
    body: joi.object({
        username: generalFields.username,
        phone: generalFields.phone,
        DOB: joi.date().iso().less("now"),// Ensures correct format & past date
        Adress:joi.string().min(5).max(200),
        medicationHistory: joi.array().items(joi.string().min(2).max(100)),
        medicalHistory: joi.array().items(joi.string().min(2).max(100)),
        gender: joi.string().valid("male", "female") .optional(),
    })
};

export const updatePassword= {
    body:joi.object().keys({
    oldPassword:generalFields.password.required(),
    password:generalFields.password.not(joi.ref("oldPassword")).required(),
    confirmationPassword:generalFields.confirmationPassword.valid(joi.ref("password")).required()

}).required()}




export const shareProfile= {
    body:joi.object().keys({
    userId:generalFields.id.required(),
  

}).required()}