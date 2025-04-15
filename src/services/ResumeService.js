import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://192.168.185.35:3000';

export const addResume = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.post(url + "/data/resume", data, {
            headers: {
                'Content-Type': 'application/json',
                // TODO: For now I am not adding the JWT Token due to time contraint, but will be doing later
            }
        });
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export const getResume = async (applicant_id) => {
    const url = API_BASE_URL;
    let endPoint = applicant_id ? `/data/resume?applicant_id=${applicant_id}` : `/data/resume`;
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

export const updateResume = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.put(url + "/data/resume", data, {
            headers: {
                'Content-Type': 'application/json',
                // TODO: For now I am not adding the JWT Token due to time contraint, but will be doing later
            }
        });
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};