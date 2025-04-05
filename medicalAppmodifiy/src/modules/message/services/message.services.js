// import messageModel from "../../../DB/model/message.model.js"
// import userModel from "../../../DB/model/User.model.js"




// export const sendMessage = async (req, res, next) => {
//   try {
//     const { message, recipientId } = req.body;

//     // Check if recipient exists and is not deleted
//     const recipient = await userModel.findOne({ _id: recipientId, isDeleted: false });
//     if (!recipient) {
//       return res.status(404).json({ message: "Invalid account ID" });
//     }

//     // Create the new message
//     const newMessage = await messageModel.create({ message, recipientId });

//     return res.status(201).json({
//       message: "Message sent successfully",
//       data: newMessage,
//     });
//   } catch (error) {
//     // Catch any unexpected errors
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message, // Include the error message
//       stack: error.stack,   // Include the error stack trace (optional, for debugging)
//     });
//   }
// };
