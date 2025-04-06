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