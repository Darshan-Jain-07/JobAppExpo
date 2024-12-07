import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card, Button, IconButton } from 'react-native-paper';
import { getUserData } from '../../services/UserDataService';

const ViewCompanyDetail = () => {
    const [ company, setCompany ] = useState({})

    useEffect(() => {
        // Define an async function inside the useEffect
        const fetchData = async () => {
            try {
                const data = await getUserData();
                setCompany(data);
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
            <Card elevation={5} style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    {/* Company Logo */}
                    <View style={styles.logoContainer}>
                        <Image source={{ uri: company.company_logo }} style={styles.logo} />
                    </View>

                    {/* Company Details */}
                    <Text style={styles.companyName}>{company.company_name}</Text>
                    <Text style={styles.companyDescription}>{company.company_description}</Text>

                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailText}>
                            <Text style={styles.label}>Email: </Text>{company.company_email}
                        </Text>
                        <Text style={styles.detailText}>
                            <Text style={styles.label}>Phone: </Text>{company.company_phone}
                        </Text>
                        <Text style={styles.detailText}>
                            <Text style={styles.label}>Company ID: </Text>{company.company_id}
                        </Text>
                        <Text style={styles.detailText}>
                            <Text style={styles.label}>Company Password: </Text>{company.company_assword}
                        </Text>
                        <Text style={styles.detailText}>
                            <Text style={styles.label}>Recruiter Password: </Text>{company.company_recruiter_password}
                        </Text>
                        <Text style={styles.detailText}>
                            <Text style={styles.label}>Created At: </Text>{company.created_at}
                        </Text>
                        <Text style={styles.detailText}>
                            <Text style={styles.label}>Updated At: </Text>{company.updated_at}
                        </Text>
                    </View>
                </Card.Content>

                {/* Actions */}
                <Card.Actions style={styles.actions}>
                    <Button mode="contained" style={styles.button}>View More</Button>
                    <IconButton
                        icon="pencil"
                        size={20}
                        style={styles.icon}
                        onPress={() => console.log('Edit Company')}
                    />
                </Card.Actions>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        margin: 16,
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
        width: 60,
        height: 60,
        borderRadius: 30,
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
        backgroundColor: '#6200ee',
    },
    icon: {
        alignSelf: 'center',
        marginLeft: 8,
    },
});

export default ViewCompanyDetail;
