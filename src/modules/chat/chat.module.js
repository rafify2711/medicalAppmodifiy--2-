import ChatMessage from '../../DB/model/chat.model.js'; 
import express from 'express';
import { Router } from 'express';
const router = Router();
import chatController from './chat.controller.js';  











const addMessage = async (user,email, message) => {
    const newMessage = new ChatMessage({
      user,
      email,
      message,
    });
  
    try {
      await newMessage.save();
      return newMessage; 
    } catch (error) {
      console.error("Error saving message:", error);  
      throw new Error('Error saving message');
    }
  };
// دالة لاسترجاع سجل المحادثات
const getChatHistory = async ( email) => {
  try {
    const messages = await ChatMessage.find( {email}).sort({ timestamp: 1 }); 
    return messages;
  } catch (error) {
    throw new Error('Error fetching chat history');
  }
};


const deleteChatByEmail = async (email) => {
    try {
      await ChatMessage.deleteMany({ email });
      return true;
    } catch (error) {
      throw new Error('Error deleting chat history');
    }
  };


  export { addMessage, getChatHistory, deleteChatByEmail};

// نقطة النهاية لإرسال رسالة جديدة
router.post('/send-message', chatController.sendMessage);

// نقطة النهاية لاسترجاع سجل المحادثات
router.get('/chat-history', chatController.getChatHistory);

router.delete('/delete-chat', chatController.deleteChatHistory);

// router.get('/chat-stream', chatController.streamChat);

export default router; 