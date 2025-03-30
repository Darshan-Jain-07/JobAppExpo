import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://192.168.185.35:3000';

export const addPayment = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.post(url + "/data/payment_history", data, {
            headers: {
                'Content-Type': 'application/json',
                // TODO: For now I am not adding the JWT Token due to time contraint, but will be doing later
            }
        });
        console.log('Response:', response.data);
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export const getPayment = async (userId) => {
    const url = API_BASE_URL;
    // console.log(companyId)
    let endPoint = `/data/payment_history?${userId ? `applicant_id=${userId}` : ``}`;
    console.log(endPoint)
    try {
        const response = await axios.get(url + endPoint, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log('Response:', response.data);
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export const getRazorpayPaymentDetails = async (razorpay_id) => {
    const url = API_BASE_URL;
    // console.log(companyId)
    let endPoint = `/payment/${razorpay_id}`;
    try {
        const response = await axios.get(url + endPoint, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log('Response:', response.data);
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export const updateJobPost = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.put(url + "/data/job_post", data, {
            headers: {
                'Content-Type': 'application/json',
                // TODO: For now I am not adding the JWT Token due to time contraint, but will be doing later
            }
        });
        // console.log(data.id)
        console.log('Response:', response.data);
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};