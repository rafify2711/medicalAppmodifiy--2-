import axios from 'axios';

const FASTAPI_BASE_URL = 'https://medical-ai-production.up.railway.app/';

export async function predictCovid19(imagePath) {
    try {
        const formData = new FormData();
        formData.append('file', imagePath); // Assuming imagePath is a File object

        const response = await axios.post(`${FASTAPI_BASE_URL}/predict/covid19/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data; // FastAPI response
    } catch (error) {
        console.error('Error calling FastAPI:', error);
        throw error;
    }
}
