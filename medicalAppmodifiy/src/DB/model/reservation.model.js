import mongoose, { model, Schema } from "mongoose";



// const reservationSchema = new Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User',
//      required: true
//      },
//   doctorId: { type: mongoose.Schema.Types.ObjectId,
//      ref: 'Doctor',
//       required: true 
//     },
//   date: { type: Date, 
//     required: true
//  },
//   timeSlot: { type: String,
//      required: true 
//     },
//   status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'],
//      default: 'Pending' 
//     },
// });


const reservationSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Completed"], // Allowed values
    default: "Confirmed" // Default status when a reservation is created
}
});

export const Reservation  = mongoose.models.Reservation||model('Reservation', reservationSchema);

export default Reservation 
