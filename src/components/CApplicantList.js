import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getUserInfo } from '../services/AuthService';
import { useNavigation } from '@react-navigation/native';

const CApplicantItem = ({ item }) => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await getUserInfo(item.applicant_id);
            setUserData(data?.[0]);
        };
        fetchUserData();
    }, [item.applicant_id]);

    if (!userData) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
                <ActivityIndicator animating={true} color={"#000"} size={"large"} />
            </View>
        );
    }

    return (
        <View style={styles.itemContainer}>
            <View style={styles.leftBorder} />
            <View style={styles.contentContainer}>
                <Image source={{ uri: userData.applicant_profile_url }} style={styles.avatar} />
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{userData.applicant_name}</Text>
                    <Text style={styles.email}>{userData.applicant_email}</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ApplicantDetail', { applicantId: item.applicant_id })} >
                    <Text style={styles.buttonText}>View Detail</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    leftBorder: {
        width: 4,
        backgroundColor: '#FF4444',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default CApplicantItem;