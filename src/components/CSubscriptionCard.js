import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import CText from './CText';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import RazorpayCheckout from 'react-native-razorpay';
import { RAZORPAY_API } from '@env';
import { addSubscription } from '../services/SubscriptionService';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    card: {
        width: width * 0.83,
        height: height * 0.7,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginRight: 15,
        marginLeft: 15,
        marginTop: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    subscriptionName: {
        textAlign: 'center',
        fontSize: 24,
        color: "#000",
    },
    header: {
        flexDirection: 'row',
    },
    price: {
        color: '#000',
        marginBottom: 10,
        marginTop: 20,
        textAlign: 'left',
    },
    descriptionContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    descriptionItemTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 30,
    },
    descriptionItem: {
        fontSize: 16,
        color: '#000',
        marginBottom: 20,
    },

    button: {
        backgroundColor: '#053766',
        paddingVertical: 12,
        position: "absolute",
        borderRadius: 6,
        bottom: 20,
        width: width * 0.7,
        right: width * 0.06,
        marginHorizontal: "auto",
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
    },
});

const CSubscriptionCard = ({ name, price, timeSpan, description, buttonText, id, applicantId, runFunc }) => {

    const handlePayment = (id, amount) => {

        const options = {
            description: "Find your job ASAP",
            image: "", // Can set ur company logo
            currency: "INR",
            key: RAZORPAY_API,
            amount: parseInt(amount) * 100,
            name: "9 to 5",
            prefill: {
                email: "9to5@gmail.com",
                contact: "9988776655",
                name: "John Doe"
            },
            theme: { color: "#eaeaea" },
        }

        RazorpayCheckout.open(options)
            .then((d) => {
                // console.log(d); // optional, good for debugging
                console.log({applicant_id: applicantId, subscription_id: id, subscription_mapping_application_left: timeSpan, is_deleted: 0})
                let resp = addSubscription({applicant_id: applicantId, subscription_id: id, subscription_mapping_application_left: timeSpan, is_deleted: 0})
                Alert.alert("Subscribed Successfully");
            })
            .catch((e) => {
                console.log(e); // optional
                Alert.alert("Payment Failed", "Something went wrong");
            });
    }

    return (
        <View style={styles.card}>
            <CText sx={styles.subscriptionName} fontWeight={800} fontSize={30}>{name}</CText>

            <View style={styles.header}>
                <CText sx={styles.price} fontSize={32}>₹ {price}/month</CText>
            </View>
            <CText sx={{ color: "#797b82", textDecorationLine: 'line-through' }} fontSize={25} fontWeight={900}>₹ {price}</CText>

            <View style={styles.descriptionContainer}>
                <CText fontSize={18} sx={styles.descriptionItemTitle}>Benefits :-</CText>
                {description?.map((point, index) => (
                    <CText key={index} fontSize={18} sx={styles.descriptionItem}>
                        <FontAwesomeIcon size={18} name="check-circle" /> {point}
                    </CText>
                ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={() => runFunc && handlePayment(id, price)}>
                <CText sx={styles.buttonText} fontSize={20} fontWeight={600}>{buttonText}</CText>
            </TouchableOpacity>
        </View>
    );
}

export default CSubscriptionCard;