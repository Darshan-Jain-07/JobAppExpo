import axios from 'axios';
import { API_BASE_URL } from '@env';

// const API_BASE_URL = 'http://192.168.185.35:3000';

export const sendOtp = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.post(url + "/send-otp-email", data, {
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

export const sendEmail = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.post(url + "/send-email", data, {
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

export const verifyOtp = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.post(url + "/verify-otp-email", data, {
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
