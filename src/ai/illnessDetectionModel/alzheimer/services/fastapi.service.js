import axios from 'axios';

const FASTAPI_BASE_URL = 'http://127.0.0.1:8000';

export async function predictalzheimer(imagePath) {
    try {
        const formData = new FormData();
        formData.append('file', imagePath); // Assuming imagePath is a File object

        const response = await axios.post(`${FASTAPI_BASE_URL}/predict/alzheimer/`, formData, {
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
