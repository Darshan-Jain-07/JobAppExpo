import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://192.168.185.35:3000';

export const identifyTable = async (id) => {
    let table
    switch (id.substring(0, 4)) {
        case "APLT":
            table = "applicant"
            break;
        case "COMP":
            table = "company"
            break;
        case "RECR":
            table = "recruiter"
            break;
        default:
            break;
    }
    return table
}

export const createCompany = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.post(url + "/data/company", data, {
            headers: {
                'Content-Type': 'application/json',
                // TODO: For now I am not adding the JWT Token due to time contraint, but will be doing later
            }
        });
        if (response.data?.insertedId) {
            logInIfSignUp("company", "company_id", response?.data?.insertedId)
        }
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export const updateCompany = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.put(url + "/data/company", data, {
            headers: {
                'Content-Type': 'application/json',
                // TODO: For now I am not adding the JWT Token due to time contraint, but will be doing later
            }
        });
        if (response.data?.message === "Data updated successfully") {
            logInIfSignUp("company", "company_id", data?.id)
        }
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export const createApplicant = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.post(url + "/data/applicant", data, {
            headers: {
                'Content-Type': 'application/json',
                // TODO: For now I am not adding the JWT Token due to time contraint, but will be doing later
            }
        });
        if (response.data?.insertedId) {
            logInIfSignUp("applicant", "applicant_id", response?.data?.insertedId)
        }
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export const updateApplicant = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.put(url + "/data/applicant", data, {
            headers: {
                'Content-Type': 'application/json',
                // TODO: For now I am not adding the JWT Token due to time contraint, but will be doing later
            }
        });
        if (response.data?.message === "Data updated successfully") {
            logInIfSignUp("applicant", "applicant_id", data?.id)
        }
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export const updateRecruiter = async (data) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.put(url + "/data/recruiter", data, {
            headers: {
                'Content-Type': 'application/json',
                // TODO: For now I am not adding the JWT Token due to time contraint, but will be doing later
            }
        });
        if (response.data?.message === "Data updated successfully") {
            logInIfSignUp("recruiter", "recruiter_id", data?.id)
        }
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export const createRecruiter = async (data) => {
    const url = API_BASE_URL;
    // if (data?.company_email_id !== "") {
    //     let isCorrectUser = await authenticateRecruiter(data?.company_email_id, data?.company_password)
    //     if (!isCorrectUser.length) {
    //         return "Company email id and/or Company Password is wrong"
    //     }
    // }
    delete data["company_password"];
    try {
        const response = await axios.post(url + "/data/recruiter", data, {
            headers: {
                'Content-Type': 'application/json',
                // TODO: For now I am not adding the JWT Token due to time contraint, but will be doing later
            }
        });
        if (response?.data?.insertedId) {
            logInIfSignUp("recruiter", "recruiter_id", response?.data?.insertedId)
        }
        return response.data
    } catch (error) {
        if (error.response) {
            // Backend responded with an error status
            if (error.response.status === 404) {
                return "Company not found. Please ensure the company exists before adding a recruiter.";
            } else if (error.response.status === 400) {
                return "Recruiter limit reached. Please upgrade your subscription.";
            } else {
                return "Something went wrong. Please try again later.";
            }
        } else {
            // Network error or server not responding
            return "Network error. Please check your internet connection.";
        }

        console.error("❌ Error in recruiter creation:", error);
        return null; // Return null to indicate failure
    }
};

export const logIn = async (table, email, password) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.get(url + `/data/${table}?${table}_email=${email}&${table}_password=${password}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(response?.data?.length === 0){
            return response.data
        }
        try {
            const colName = `${table}_id`;
            const userResponse = await axios.get(url + `/data/users?user_id=${response?.data?.[0]?.[colName]}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            response.data[0]["user_id"] = userResponse?.data?.[0]?.id;
            return response.data
        } catch (error) {
            console.error('Error:', error);
        }
        // return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

// Creating this function because when user signup it should be login automatically
export const logInIfSignUp = async (table, col_name, id) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.get(url + `/data/${table}?${col_name}=${id}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        await AsyncStorage.setItem('user', JSON.stringify({ ...response.data?.[0], role: table }));
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export const getUserInfo = async (id) => {
    const url = API_BASE_URL;
    let table = await identifyTable(id);

    try {
        const response = await axios.get(url + `/data/${table}?${table}_id=${id}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export const authenticateRecruiter = async (email, password) => {
    const url = API_BASE_URL;
    try {
        const response = await axios.get(url + `/data/company?company_email=${email}&company_recruiter_password=${password}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

