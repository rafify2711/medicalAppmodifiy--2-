import joi from "joi"
import { generalFields } from "../../middleware/validation.middleware.js"

export const signup= {

body:joi.object().keys({
    username:generalFields.username.required(),
    email:generalFields.email.required(),
    password:generalFields.password.required(),
    confirmationPassword:joi.string().valid(joi.ref('password')).required(),
    role:joi.string().valid('User', 'Admin', 'Doctor').default('User').required(),
    specialty:joi.string().valid("General Practitioner",
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
    "Urology")

}).required().options({allowUnknown:false})
    
// params:joi.object().keys({
//     id:joi.boolean().required()
// }).required().options({allowUnknown:false}),
}


export const login= {

    body:joi.object().keys({
        email:generalFields.email.required(),
        password:generalFields.password.required()
    })
}

export const forgotPassword = {
    body: joi.object().keys({
      email: generalFields.email.required()
        .messages({
          'string.email': 'Please enter a valid email address.',
          'any.required': 'Email is required.',
        }),
    }),
  };

export const resetPassword = {
    body:joi.object().keys({ 
      email: generalFields.email.required(),
     otp: joi.string().length(6).required().messages({
      'string.length': 'OTP must be 6 digits',
      'any.required': 'OTP is required'}),
    newPassword: generalFields.password.required().messages({
        'string.pattern.base': 'Password must be 8-12 characters, include uppercase, lowercase, number, and special character.',
        'any.required': 'Password is required'
      })
  })
}