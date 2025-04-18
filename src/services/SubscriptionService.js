import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://192.168.185.35:3000';

export const getSubscription = async (user_role, is_deleted, subscription_id) => {
    const url = API_BASE_URL;
    let endPoint = `/data/subscription?${user_role ? `subscription_user_role=${user_role}&` : ``}${is_deleted ? `is_deleted=${is_deleted}&` : ``}${subscription_id ? `subscription_id=${subscription_id}&` : ``}`;
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

export const getSubscriptionMapping = async (applicantId, isDeleted) => {
    const url = API_BASE_URL;
    let endPoint = `/data/subscription_mapping?${applicantId ? `applicant_id=${applicantId}&` : ``}${isDeleted ? `is_deleted=${isDeleted}&` : ``}`;
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

export const addSubscription = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.post(url + "/data/subscription_mapping", data, {
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

export const updateSubscription = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.put(url + "/data/subscription_mapping", data, {
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