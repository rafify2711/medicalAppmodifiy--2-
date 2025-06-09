import mongoose, { model, Schema } from "mongoose";
import { roleTypes } from "../../middleware/auth.middleware.js";




const doctorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'please enter your username'],
    minlength: 2,
    maxlength: 50
  },
  name:{
    type: String,
   default:'username',
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true 
  },
  specialty: {
    type: String,
    required: true,
    enum: [
      "General Practitioner", "Family Medicine", "Internal Medicine", "Cardiology",
      "Neurology", "Endocrinology", "Pulmonology", "Gastroenterology", "Nephrology",
      "Rheumatology", "General Surgery", "Orthopedic Surgery", "Neurosurgery",
      "Plastic Surgery", "Emergency Medicine", "Obstetrics & Gynecology", "Pediatrics",
      "Neonatology", "Psychiatry", "Psychology", "Dermatology", "Ophthalmology",
      "Otolaryngology (ENT)", "Allergy & Immunology", "Oncology", "Hematology",
      "Infectious Diseases", "Anesthesiology", "Geriatrics", "Urology"
    ]
  },
  password: {
    type: String,
    required: true
  },
 
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'male'
  },
  role: {
    type: String,
    enum: ['User', 'Admin', 'Doctor'],
    default: "Doctor"
  },
  changePasswordTime: {
    type: Date,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  profilePhoto: {
    type: String,
    default: ""
  },

  experience: {
    type: Number,
    min: 0,
    default: 0
  },
  careerPath: {
    type: [String], // An array of strings
    default: []
  },
  highlights: {
    type: [String], // An array of strings
    default: []
  },
  bio: {
    type: String, // A general "about me" description
    maxlength: 2000,
    default: ""
  },

  schedule: [
    {
      date: { type: Date, required: true },  // Ensure date is in correct format 
      timeSlots: [{ type: String, required: true }] // Expect an array of strings  
    }
  ],
  reservations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      default: null
    }
  ],
  contact: {
    website: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    phone: { type: String, default: "" } // optional second number
  },

}, { timestamps: true });





export const Doctor = mongoose.models.Doctor || model ('Doctor', doctorSchema);

export default Doctor












