import axios from 'axios';

const API_BASE_URL = 'http://192.168.208.35:3000/';

export const createCompany = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.post(url + "data/company", data, {
            headers: {
                'Content-Type': 'application/json',
                // TODO: For now I am not adding the JWT Token due to time contraint, but will be doing later
            }
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error);
    }
};

