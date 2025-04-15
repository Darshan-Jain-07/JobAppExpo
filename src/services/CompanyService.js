import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://192.168.185.35:3000';

export const getCompany = async (id, limit) => {
    const url = API_BASE_URL;
    let endPoint = `/data/company?${id ? `company_id=${id}&` : ``}${limit ? `limit=${limit}` : ``}`;
    try {
        const response = await axios.get(url + endPoint, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};