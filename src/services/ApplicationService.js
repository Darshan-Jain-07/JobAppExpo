import axios from 'axios';
import { API_BASE_URL, API_BASE_URL_ATS } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://192.168.185.35:3000';

export const applyJobPost = async (data, resumeData, jobPostData) => {
    const url = API_BASE_URL;
    try {
        // const analyzeResponse = await axios.post(API_BASE_URL_ATS + "/analyze", {
        //     resume: resumeData,
        //     jobDescription: jobPostData
        // });

        // if (!analyzeResponse.data.success) {
        //     console.error("Analysis failed:", analyzeResponse.data.error);
        //     return { error: "ATS analysis failed" };
        // }

        // const analysisResult = analyzeResponse.data.analysis; // Get ATS feedback

        // // 🔹 Step 2: Attach ATS Analysis Result to `data`
        // const updatedData = {
        //     ...data,
        //     atsScore: analysisResult.ATS_Score || "N/A",
        //     missingSkills: analysisResult.Missing_Skills || [],
        //     formattingIssues: analysisResult.Formatting_Issues || [],
        //     improvementSuggestions: analysisResult.Improvements || []
        // };

        // console.log(updatedData, "updatedData")

        const response = await axios.post(url + "/data/application", data, {
            headers: {
                'Content-Type': 'application/json',
                // TODO: For now I am not adding the JWT Token due to time contraint, but will be doing later
            }
        });
        return response.data
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code outside 2xx
            return error.response.data; // Return the response message if available
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            return "No response from server";
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error Message:', error.message);
            return error.message;
        }
    }
};

export const appliedJob = async (applicantId, jobpostId) => {
    const url = API_BASE_URL;
    let endPoint = `/data/application?${applicantId ? `applicant_id=${applicantId}&` : ``}${jobpostId ? `job_post_id=${jobpostId}` : ``}`;
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

export const getApplication = async (application_id, job_post_id, limit) => {
    const url = API_BASE_URL;
    let endPoint = `/data/application?${application_id ? `application_id=${application_id}&` : ``}${job_post_id ? `job_post_id=${job_post_id}&` : ``}${limit ? `limit=${limit}&` : ``}`;
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

export const updateApplication = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.put(url + "/data/application", data, {
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