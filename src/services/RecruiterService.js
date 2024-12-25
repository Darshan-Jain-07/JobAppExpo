import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://192.168.185.35:3000';

export const getRecruiter = async (id, limit, recruiter_id, recruiter_email) => {
    const url = API_BASE_URL;
    let endPoint = `/data/recruiter?${id ? `company_email_id=${id}&` : ``}${limit ? `limit=${limit}` : ``}${recruiter_id ? `recruiter_id=${recruiter_id}` : ``}${recruiter_email ? `recruiter_email=${recruiter_email}` : ``}`;
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