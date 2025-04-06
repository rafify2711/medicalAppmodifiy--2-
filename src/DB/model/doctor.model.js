import mongoose, { model, Schema } from "mongoose";
import { roleTypes } from "../../middleware/auth.middleware.js";




const doctorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'please enter your username'],
    minlength: 2,
    maxlength: 50
},
  email: {
    type: String,
    unique: true,
    required: true
},
specialty: {
  type: String,
  required: true,
  enum: [
    "General Practitioner",
    "Family Medicine",
    "Internal Medicine",
    "Cardiology",
    "Neurology",
    "Endocrinology",
    "Pulmonology",
    "Gastroenterology",
    "Nephrology",
    "Rheumatology",
    "General Surgery",
    "Orthopedic Surgery",
    "Neurosurgery",
    "Plastic Surgery",
    "Emergency Medicine",
    "Obstetrics & Gynecology",
    "Pediatrics",
    "Neonatology",
    "Psychiatry",
    "Psychology",
    "Dermatology",
    "Ophthalmology",
    "Otolaryngology (ENT)",
    "Allergy & Immunology",
    "Oncology",
    "Hematology",
    "Infectious Diseases",
    "Anesthesiology",
    "Geriatrics",
    "Urology",
  ],
},
password: {
  type: String,
  required: true
},
phone: {
  type: String,
  default: null

},

gender: {
  type: String,
  enum: ['male', 'female'],
  default: 'male'
},

changePasswordTime:{ 
  type: Date,
  default: null
},

isDeleted:{type:Boolean, default:false},

profilePhoto: {
  type: String, // URL for the profile photo
  default: "",
},
  schedule: [
    {
      date: { type: Date, required: true },  // Ensure date is in correct format
      timeSlots: [{ type: String, required: true }]  //  Expect an array of strings
    }
  ],
  
  reservations: [{ type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "Reservation" }]

});




export const Doctor = mongoose.models.Doctor || model ('Doctor', doctorSchema);

export default Doctor












