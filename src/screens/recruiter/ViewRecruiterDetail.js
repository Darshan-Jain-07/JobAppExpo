import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card, Button, IconButton } from 'react-native-paper';
import { getUserData } from '../../services/UserDataService';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

const ViewRecruiterDetail = () => {
    const [ recruiter, setRecruiter ] = useState({});
    const navigation = useNavigation();
    useEffect(() => {
        // Define an async function inside the useEffect
        const fetchData = async () => {
            try {
                const data = await getUserData();
                setRecruiter(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Call the async function
        fetchData();
    }, []);
    return (
        <View style={styles.cardContainer}>
            <Button
                mode="text"
                icon="keyboard-backspace"
                onPress={() => navigation.goBack()}
                style={{ display:"flex", alignItems:"flex-start", paddingLeft:10, marginBottom:20}}
                labelStyle={{ color: 'black' }} // Use labelStyle for text color
            >
                Back
            </Button>
            <Card elevation={5} style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    {/* Company Logo */}
                    <View style={styles.logoContainer}>
                        <Image source={{ uri: recruiter.recruiter_image }} style={styles.logo} />
                    </View>

                    {/* Company Details */}
                    <Text style={styles.companyName}>{recruiter.recruiter_name}</Text>
                    <Text style={styles.companyDescription}>{recruiter.recruiter_description}</Text>

                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailText}>
                            <Text style={styles.label}>Email: </Text>{recruiter.recruiter_email}
                        </Text>
                        <Text style={styles.detailText}>
                            <Text style={styles.label}>Phone: </Text>{recruiter.recruiter_phone}
                        </Text>
                        <Text style={styles.detailText}>
                            <Text style={styles.label}>Company Email ID: </Text>{recruiter?.company_email_id === "" ? "N/A" : recruiter?.company_email_id}
                        </Text>
                        <Text style={styles.detailText}>
                            <Text style={styles.label}>Password: </Text>{recruiter.recruiter_password}
                        </Text>
                        <Text style={styles.detailText}>
                            <Text style={styles.label}>Created At: </Text>{dayjs(recruiter.created_at).format('DD/MM/YYYY')}
                        </Text>
                        <Text style={styles.detailText}>
                            <Text style={styles.label}>Updated At: </Text>{dayjs(recruiter.updated_at).format('DD/MM/YYYY')}
                        </Text>
                    </View>
                </Card.Content>

                {/* Actions */}
                <Card.Actions style={styles.actions}>
                    <Button mode="contained" style={styles.button}>Subscription Details</Button>
                    <IconButton
                        icon="pencil"
                        size={20}
                        style={styles.icon}
                        onPress={() => navigation.navigate("Sign Up Recruiter")}
                    />
                </Card.Actions>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        margin: 16,
        marginTop: 50,
    },
    card: {
        borderRadius: 10,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, // for Android
    },
    cardContent: {
        padding: 16,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
    },
    companyName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    companyDescription: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 16,
    },
    detailsContainer: {
        marginVertical: 10,
    },
    detailText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 6,
    },
    label: {
        fontWeight: 'bold',
    },
    actions: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    button: {
        flex: 1,
        marginRight: 8,
        backgroundColor: '#000',
    },
    icon: {
        alignSelf: 'center',
        marginLeft: 8,
    },
});

export default ViewRecruiterDetail;
