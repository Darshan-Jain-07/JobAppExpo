import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import CText from './CText';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import RazorpayCheckout from 'react-native-razorpay';
import { RAZORPAY_API } from '@env';
import { addSubscription } from '../services/SubscriptionService';
import { getRazorpayPaymentDetails } from '../services/PaymentService';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    card: {
        width: width * 0.85,
        height: height * 0.7,
        padding: 20,
        backgroundColor: '#000000',
        borderRadius: 10,
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    subscriptionName: {
        color: "#ffffff",
    },
    header: {
        flexDirection: 'row',
    },
    price: {
        color: '#fff',
        marginBottom: 16,
        marginTop: 20,
        textAlign: 'left',
    },
    descriptionContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    descriptionItem: {
        fontSize: 16,
        color: '#cfd0d4',
        marginBottom: 6,
    },
    button: {
        backgroundColor: '#2e2f30',
        paddingVertical: 12,
        position: "absolute",
        borderRadius: 6,
        bottom: 20,
        width: width * 0.7,
        right: width * 0.08,
        marginHorizontal: "auto",
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
    },
});

const CSubscriptionCard = ({ name, price, timeSpan, description, buttonText, id, applicantId, runFunc, userData }) => {

    // const handlePayment = (id, amount) => {

    //     const options = {
    //         description: "Find your job ASAP",
    //         image: "", // Can set ur company logo
    //         currency: "INR",
    //         key: RAZORPAY_API,
    //         amount: parseInt(amount) * 100,
    //         name: "9 to 5",
    //         prefill: {
    //             email: "9to5@gmail.com",
    //             contact: "9988776655",
    //             name: "John Doe"
    //         },
    //         theme: { color: "#eaeaea" },
    //     }

    //     RazorpayCheckout.open(options)
    //         .then((d) => {
    //             // console.log(d); // optional, good for debugging
    //             console.log({applicant_id: applicantId, subscription_id: id, subscription_mapping_application_left: timeSpan, is_deleted: 0})
    //             let resp = addSubscription({applicant_id: applicantId, subscription_id: id, subscription_mapping_application_left: timeSpan, is_deleted: 0})
    //             Alert.alert("Subscribed Successfully");
    //         })
    //         .catch((e) => {
    //             console.log(e); // optional
    //             Alert.alert("Payment Failed", "Something went wrong");
    //         });
    // }

    const handlePayment = async (id, amount) => {
        const options = {
            description: "Find your job ASAP",
            image: "", // Company logo URL
            currency: "INR",
            key: RAZORPAY_API,
            amount: parseInt(amount) * 100,
            name: "9 to 5",
            prefill: {
                email: userData?.applicant_email, // Dynamically fetch user email
                contact: userData?.applicant_phone, // Dynamically fetch user contact
                name: userData?.applicant_name // Dynamically fetch user name
            },
            theme: { color: "#eaeaea" },
        };
    
        try {
            const paymentResponse = await RazorpayCheckout.open(options);
    
            // Log the response from Razorpay
            console.log("Payment Response:", paymentResponse);

            let razorpayData = await getRazorpayPaymentDetails(paymentResponse?.razorpay_payment_id)
            console.log(razorpayData)
    
            // Prepare data for backend
            const paymentData = {
                applicant_id: applicantId,
                subscription_id: id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id || null, // Some payments may not have an order ID
                razorpay_signature: paymentResponse.razorpay_signature,
                amount: amount,
                status: "success",
                payment_method: paymentResponse.method, // Capture payment method
                card_id: paymentResponse.card_id || null,
                bank: paymentResponse.bank || null,
                wallet: paymentResponse.wallet || null,
                email: userData?.applicant_email,
                contact: userData?.applicant_phone,
                created_at: new Date().toISOString()
            };
            // This payment data will be stored in payment_history table and from there I will use this data to show in Payment History Screen
            console.log(paymentData);
    
            // Send data to backend
            // const resp = await addSubscription(paymentData);
            let resp = addSubscription({applicant_id: applicantId, subscription_id: id, subscription_mapping_application_left: timeSpan, is_deleted: 0})
            Alert.alert("Subscribed Successfully");

        } catch (e) {
            console.log("Payment Error:", e);
    
            // Log failed payment attempt in the database
            const failedPaymentData = {
                applicant_id: applicantId,
                subscription_id: id,
                amount: amount,
                status: "failed",
                error_description: e.description || "Unknown error",
                created_at: new Date().toISOString()
            };
    
            await addSubscription(failedPaymentData);
    
            Alert.alert("Payment Failed", "Something went wrong");
        }
    };
    
    return (
        <View style={styles.card}>
            <CText sx={styles.subscriptionName} fontWeight={800} fontSize={30}>{name}</CText>

            <View style={styles.header}>
                <CText sx={styles.price} fontSize={50}>{price}</CText>
            </View>
            <CText sx={{ color: "#797b82" }} fontSize={25} fontWeight={900}>{timeSpan}</CText>

            <View style={styles.descriptionContainer}>
                <CText fontSize={18} sx={styles.descriptionItem}>Benefits:-</CText>
                {description?.map((point, index) => (
                    <CText key={index} fontSize={18} sx={styles.descriptionItem}>
                        <FontAwesomeIcon size={20} name="check-circle" /> {point}
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