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
      required: true,
      lowercase: true 
    }
    ,
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
  
    role: {
        type: String,
        enum: ['User','Admin','Doctor'],
        default: "User"
    },
    DOB: {
        type: Date,
        default: null

        // required: true,
      },

      changePasswordTime:{ 
        type: Date,
        default: null
      },

      isDeleted:{type:Boolean, default:false},

      profileImage: {
        type: String, // URL for the profile photo
        default: "",
      },

      reservations: [{ type: mongoose.Schema.Types.ObjectId,
        default: null,
         ref: 'Reservation' }],

      Adress: {
        type: String,
        default: null
    
      },
      medicationHistory: {
        type: String,
        default: null
    
      },

      resetToken: String,
      resetTokenExpiry: Date,
 
}, { timestamps: true })



const userModel = mongoose.models.User ||  model("User", userSchema)

export default userModel
