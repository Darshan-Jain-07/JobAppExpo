import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, Alert, TextInput } from 'react-native';
import { getUserInfo } from '../services/AuthService';
import { useNavigation } from '@react-navigation/native';
import CText from './CText';
import { sendEmail } from '../services/EmailOtpService';
import { updateApplication } from '../services/ApplicationService';

const CApplicantItem = ({ item, func }) => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("Congratulations! You’ve been Accepted");
    const [message, setMessage] = useState("Dear Applicant,\n\nWe are pleased to inform you that you have been accepted for the next phase. Please check your email for further details.\n\nBest Regards,\nTeam");

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await getUserInfo(item.applicant_id);
            setUserData(data?.[0]);
            setEmail(data?.[0]?.applicant_email)
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

    const handleSendEmail = async () => {
        let send = sendEmail({ email, subject, content: message })
        let setApprove = updateApplication({ id: item.application_id, application_status: "accepted" })
        setModalVisible(false);
        func()
        Alert.alert("Email Sent", `Email sent successfully.`);

    };

    return (
        <TouchableOpacity onPress={() => { navigation.navigate('View Applicant Detail', { applicationId: item?.applicant_id }); if(item?.application_status === "rejected" || item?.application_status === "accepted" || item?.application_status === "in_review"){
            } else{updateApplication({id: item?.application_id, application_status: "in_review"})} }}>

            <View style={styles.itemContainer}>
                <View style={styles.leftBorder} />
                <View style={styles.contentContainer}>
                    <Image source={{ uri: userData.applicant_profile_url }} style={styles.avatar} />
                    <View style={styles.textContainer}>
                        <CText sx={styles.name} fontWeight={600}>{userData.applicant_name}</CText>
                        <CText sx={styles.email}>{userData.applicant_email}</CText>
                    </View>

                    {(item?.application_status === "pending" || item?.application_status === "in_review") && <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.optionButton, styles.acceptButton]} onPress={() => handleAccept(item.applicant_id)}>
                            <CText sx={styles.buttonText}>Accept</CText>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.optionButton, styles.rejectButton]} onPress={() => { setModalVisible(false); let setRejected = updateApplication({ id: item.application_id, application_status: "rejected" }); func(); Alert.alert("Rejected", "Applicant rejected.") }}>
                            <CText sx={styles.buttonText}>Reject</CText>
                        </TouchableOpacity>
                    </View>}
                    {item?.application_status === "accepted" && <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.optionButton, styles.acceptButton]}>
                            <CText sx={styles.buttonText}>Accepted</CText>
                        </TouchableOpacity>
                    </View>}
                    {item?.application_status === "rejected" && <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.optionButton, styles.rejectButton]}>
                            <CText sx={styles.buttonText}>Rejected</CText>
                        </TouchableOpacity>
                    </View>}
                </View>

                {/* Modal for Sending Email */}
                <Modal visible={modalVisible} animationType="slide" transparent>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <CText sx={styles.modalTitle} fontWeight={600}>Send Acceptance Email</CText>
                            <CText sx={styles.modalInputTitle}>Email :-</CText>
                            <TextInput style={styles.input} value={email} placeholder="Email ID" />
                            <CText sx={styles.modalInputTitle}>Subject :-</CText>
                            <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="Subject" />
                            <CText sx={styles.modalInputTitle}>Description :-</CText>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Description"
                                multiline
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.button, styles.sendButton]} onPress={handleSendEmail}>
                                    <CText sx={styles.buttonText}>Send</CText>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => { setModalVisible(false); }}>
                                    <CText sx={styles.buttonText}>Cancel</CText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </View>
        </TouchableOpacity>

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
        fontSize: 10,
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