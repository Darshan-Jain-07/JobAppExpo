import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserData = async () => {
    try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
            return JSON.parse(userData);
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error retrieving user data', error);
        return null;
    }
};

export const clearUserData = async () => {
    try {
        await AsyncStorage.removeItem('user');
        console.log('User data cleared from AsyncStorage');
    } catch (error) {
        console.error('Error clearing user data from AsyncStorage', error);
    }
};
