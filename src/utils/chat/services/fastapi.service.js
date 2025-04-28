import axios from 'axios'; 

const askChatbot = async (prompt) => {
    try {
        const response = await axios.post(`https://medical-ai-production.up.railway.app//chat/?prompt=${encodeURIComponent(prompt)}`);
        return response.data;
      } catch (error) {
        console.error('Error contacting chatbot:', error.message);
        return 'Sorry, there was an error contacting the chatbot.';
      }
};
export {  askChatbot};