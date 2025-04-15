import axios from 'axios';
import { API_BASE_URL } from '@env';
// const API_BASE_URL = 'http://192.168.185.35:3000';

export const getCompanyData = async (col_name, col_value) => {
    const url = API_BASE_URL;
    try {
        let endPoint = col_name && col_value ? `/data/company?${col_name}=${col_value}` : "/data/company"
        const response = await axios.get(url + endPoint, {
            headers: {
                'Content-Type': 'application/json',
                // TODO: For now I am not adding the JWT Token due to time contraint, but will be doing later
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
};

