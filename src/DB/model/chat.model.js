import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model('ChatMessage', chatSchema);

export default ChatMessage;
