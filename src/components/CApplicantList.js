import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, Alert, TextInput } from 'react-native';
import { getUserInfo } from '../services/AuthService';
import { useNavigation } from '@react-navigation/native';

const CApplicantItem = ({ item }) => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    // const [email, setEmail] = useState(applicant_email);
    const [subject, setSubject] = useState("Congratulations! You’ve been Accepted");
    const [message, setMessage] = useState("Dear Applicant,\n\nWe are pleased to inform you that you have been accepted for the next phase. Please check your email for further details.\n\nBest Regards,\nTeam");

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

    const handleAccept = () => {
        setModalVisible(true);
    };

    const handleSendEmail = () => {
        Alert.alert("Email Sent", `Email sent successfully.`);
        setModalVisible(false);
    };

    return (
        <View style={styles.itemContainer}>
    <View style={styles.leftBorder} />
    <View style={styles.contentContainer}>
        <Image source={{ uri: userData.applicant_profile_url }} style={styles.avatar} />
        <View style={styles.textContainer}>
            <Text style={styles.name}>{userData.applicant_name}</Text>
            <Text style={styles.email}>{userData.applicant_email}</Text>
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.optionButton, styles.acceptButton]} onPress={() => handleAccept(item.applicant_id)}>
                <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.optionButton, styles.rejectButton]} onPress={() => Alert.alert("Rejected", "Applicant rejected.")}>
                <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
        </View>
    </View>

        {/* Modal for Sending Email */}
        <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Send Acceptance Email</Text>
                        <Text style={styles.modalInputTitle}>Email :-</Text>
                        <TextInput style={styles.input} value={userData.applicant_email}  placeholder="Email ID" />
                        <Text style={styles.modalInputTitle}>Subject :-</Text>
                        <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="Subject" />
                        <Text style={styles.modalInputTitle}>Description :-</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Description"
                            multiline
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.button, styles.sendButton]} onPress={handleSendEmail}>
                                <Text style={styles.buttonText}>Send</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
        width: 5,
        height: '100%',
        backgroundColor: '#4CAF50',
        position: 'absolute',
        left: 0,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    avatar: {
        backgroundColor: '#EFEFEF',
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
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
    button: {
        // alignItems: 'center',
        // minWidth: 100,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    buttonContainer: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    
    optionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        margin: 5,
        borderRadius: 6,
        alignItems: 'center',
        width: 100,
    },
    acceptButton: {
        backgroundColor: '#4CAF50', // Green for Accept
    },
    rejectButton: {
        backgroundColor: '#E53935', // Red for Reject
    },
    
    textContainer: {
        flex: 1,
    },
    name: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
    },
    

    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        padding: 20,
        width: '85%',
        borderRadius: 10,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalInputTitle: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    sendButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#E53935',
        padding: 10,
        borderRadius: 5,
    },
});

export default CApplicantItem;