import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://192.168.185.35:3000';

export const createJobPost = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.post(url + "/data/job_post", data, {
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

export const getJobPost = async (companyId, userId, limit, jobpostId) => {
    const url = API_BASE_URL;
    let endPoint = `/data/job_post?${companyId ? `company_id=${companyId}&` : ``}${limit ? `limit=${limit}` : ``}${userId ? `recruiter_id=${userId}` : ``}${jobpostId ? `job_post_id=${jobpostId}` : ``}`;
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

export const updateJobPost = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.put(url + "/data/job_post", data, {
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