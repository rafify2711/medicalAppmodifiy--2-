import { addMessage, getChatHistory ,deleteChatByEmail  } from './chat.module.js'
import {askChatbot} from './services/fastapi.service.js'

const chatController = {
  sendMessage : async (req, res) => {
  const { user, email, message } = req.body; 
  try {
    const newMessage = await addMessage(user, email, message);
    const botReply = await askChatbot(message);
    const botMessage = await addMessage('chatbot', email, botReply);
    res.status(200).json({newMessage, botMessage,});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},


   getChatHistory : async (req, res) => {
    const {  email } = req.query;
  try {
    const messages = await getChatHistory( email);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

  deleteChatHistory : async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required to delete chat history' });
  }

  try {
    await deleteChatByEmail(email);
    res.status(200).json({ message: 'Chat history deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting chat history' });
  }
}
};
export default chatController;

