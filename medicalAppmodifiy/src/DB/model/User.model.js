import mongoose, { model, Schema } from "mongoose";
import { roleTypes } from "../../middleware/auth.middleware.js";

console.log(Object.values(roleTypes));


const userSchema = new Schema({

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
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        
    },
 
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male'
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['User','Admin','Doctor'],
        default: "User"
    },
    DOB: {
        type: Date,
        // required: true,
      },
      changePasswordTime:Date,

      isDeleted:{type:Boolean, default:false},

      profilePhoto: {
        type: String, // URL for the profile photo
        default: "",
      },
      reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
      Adress: {
        type: String
    
      },
      medicationHistory: {
        type: String
    
      },
 
}, { timestamps: true })



const userModel = mongoose.models.User ||  model("User", userSchema)

export default userModel
