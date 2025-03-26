import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://192.168.185.35:3000';

export const getSubscription = async (user_role, is_deleted) => {
    const url = API_BASE_URL;
    // console.log(companyId)
    let endPoint = `/data/subscription?${user_role ? `subscription_user_role=${user_role}&` : ``}${is_deleted ? `is_deleted=${is_deleted}&` : ``}`;
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

export const getSubscriptionMapping = async (applicantId, isDeleted) => {
    const url = API_BASE_URL;
    // console.log(companyId)
    let endPoint = `/data/subscription_mapping?${applicantId ? `applicant_id=${applicantId}&` : ``}${isDeleted ? `is_deleted=${isDeleted}&` : ``}`;
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

export const addSubscription = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.post(url + "/data/subscription_mapping", data, {
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