import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { getUserData } from '../../services/UserDataService';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import CText from '../../components/CText';

const ViewRecruiterDetail = () => {
    const [ recruiter, setRecruiter ] = useState({});
    const navigation = useNavigation();
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        // Define an async function inside the useEffect
        const fetchData = async () => {
            try {
                const data = await getUserData();
                setRecruiter(data);
                console.log(data);
                setIsDataLoaded(true);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsDataLoaded(true);
            }
        };

        // Call the async function
        fetchData();
    }, []);
    
  if (!isDataLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
        <ActivityIndicator animating={true} color={"#000"} size={"large"} />
      </View>
    )
  }
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
                    <CText sx={styles.companyName}>{recruiter.recruiter_name}</CText>
                    <CText sx={styles.companyDescription}>{recruiter.recruiter_description}</CText>

                    <View style={styles.detailsContainer}>
                        <CText sx={styles.detailText}>
                            <CText fontWeight={600} sx={styles.label}>Email: </CText>{recruiter.recruiter_email}
                        </CText>
                        <CText sx={styles.detailText}>
                            <CText fontWeight={600} sx={styles.label}>Phone: </CText>{recruiter.recruiter_phone}
                        </CText>
                        <CText sx={styles.detailText}>
                            <CText fontWeight={600} sx={styles.label}>Company Email ID: </CText>{recruiter?.company_email_id === "" ? "N/A" : recruiter?.company_email_id}
                        </CText>
                        <CText sx={styles.detailText}>
                            <CText fontWeight={600} sx={styles.label}>Password: </CText>{recruiter.recruiter_password}
                        </CText>
                        <CText sx={styles.detailText}>
                            <CText fontWeight={600} sx={styles.label}>Created At: </CText>{dayjs(recruiter.created_at).format('DD/MM/YYYY hh:mm a')}
                        </CText>
                        <CText sx={styles.detailText}>
                            <CText fontWeight={600} sx={styles.label}>Updated At: </CText>{dayjs(recruiter.updated_at).format('DD/MM/YYYY hh:mm a')}
                        </CText>
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
