import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://192.168.185.35:3000';

export const createBlog = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.post(url + "/data/blog", data, {
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

export const getBlog = async (id, userId, limit) => {
    const url = API_BASE_URL;
    let endPoint = id ? `/data/blog?blog_id=${id}` : userId ? `/data/blog?created_by_id=${userId}` : limit ? `/data/blog?limit=${limit}` : `/data/blog`;
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