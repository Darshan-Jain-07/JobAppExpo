import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { Card, Button, Divider } from "react-native-paper";
import CText from "./CText";
import RazorpayCheckout from 'react-native-razorpay';
import { RAZORPAY_API } from '@env';
import { addPayment, getRazorpayPaymentDetails } from "../services/PaymentService";
import { addSubscription, getSubscriptionMapping, updateSubscription } from "../services/SubscriptionService";

const CCustomizeSubscriptionCard = ({ userData, applicantId, refreshFunc, id }) => {
    const [recruiters, setRecruiters] = useState(1);
    const [jobPosts, setJobPosts] = useState(1);

    const BASE_FEE = 200;
    const RECRUITER_FEE = 100;
    const JOB_POST_FEE = 35;

    const totalPrice = BASE_FEE + recruiters * RECRUITER_FEE + jobPosts * JOB_POST_FEE;

    let discount = 0;
    if (totalPrice > 5000) {
        discount = 0.20;
    } else if (totalPrice > 1000) {
        discount = 0.10;
    } else if (totalPrice > 500) {
        discount = 0.05;
    }

    const discountAmount = totalPrice * discount;
    const finalPrice = totalPrice - discountAmount;

    const handlePayment = async (id, amount) => {
        const options = {
            description: "Find your job ASAP",
            image: "", // Company logo URL
            currency: "INR",
            key: RAZORPAY_API,
            amount: parseInt(amount) * 100,
            name: "9 to 5",
            prefill: {
                email: userData?.applicant_email || userData?.company_email || userData?.recruiter_email,
                contact: userData?.applicant_phone || userData?.company_phone || userData?.recruiter_phone,
                name: userData?.applicant_name || userData?.company_name || userData?.recruiter_name
            },
            theme: { color: "#eaeaea" },
        };

        try {
            const paymentResponse = await RazorpayCheckout.open(options);

            console.log("Payment Response:", paymentResponse);

            let razorpayData = await getRazorpayPaymentDetails(paymentResponse?.razorpay_payment_id)
            console.log(razorpayData?.payment, "razorpaypaymentdata")

            // Prepare data for backend
            const paymentData = {
                applicant_id: applicantId,
                subscription_id: id,
                razorpay_payment_id: paymentResponse?.razorpay_payment_id,
                razorpay_order_id: razorpayData?.payment?.order_id || null,
                razorpay_signature: razorpayData?.razorpay_signature,
                payment_amount: amount,
                payment_status: "success",
                payment_method: razorpayData?.payment?.method,
                card_id: razorpayData?.payment?.card_id || null,
                bank: razorpayData?.payment?.bank || null,
                wallet: razorpayData?.payment?.wallet || null
            };
            // This payment data will be stored in payment_history table and from there I will use this data to show in Payment History Screen
            console.log(paymentData, "paymentData");

            let pay = await addPayment(paymentData)
            let subData = await getSubscriptionMapping(applicantId)
            if (subData?.length) {
                updateSubscription({ id: subData?.[0]?.subscription_mapping_id, subscription_id: id, subscription_mapping_application_left: parseInt(subData?.[0]?.subscription_mapping_application_left) + parseInt(jobPosts), subscription_mapping_recruiter: parseInt(subData?.[0]?.subscription_mapping_recruiter) + parseInt(recruiters), is_deleted: 0 })
            } else {
                let resp = addSubscription({ applicant_id: applicantId, subscription_id: id, subscription_mapping_application_left: jobPosts, subscription_mapping_recruiter: recruiters, is_deleted: 0 })
            }
            refreshFunc()


            // Send data to backend
            // const resp = await addSubscription(paymentData);
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
        <Card style={{ padding: 20, margin: 20, borderRadius: 10, elevation: 4 }}>
            <CText sx={{ fontSize: 22, textAlign: "center", marginBottom: 10 }} fontWeight={600}>
                Custom Plan
            </CText>

            {/* Fee Breakdown */}
            <View style={{ marginBottom: 10 }}>
                <CText sx={{ fontSize: 16, color: "gray" }}>🔹 Base Fee: ₹{BASE_FEE}</CText>
                <CText sx={{ fontSize: 16, color: "gray" }}>👤 Per Recruiter: ₹{RECRUITER_FEE}</CText>
                <CText sx={{ fontSize: 16, color: "gray" }}>📌 Per Job Post: ₹{JOB_POST_FEE}</CText>
            </View>

            <Divider style={{ marginVertical: 10 }} />

            {/* Recruiter Counter */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <CText sx={{ fontSize: 18 }}>Recruiters:</CText>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Button mode="contained-tonal" onPress={() => setRecruiters(Math.max(1, recruiters - 1))}>-</Button>
                    <CText sx={{ fontSize: 18, marginHorizontal: 10 }}>{recruiters}</CText>
                    <Button mode="contained-tonal" onPress={() => setRecruiters(recruiters + 1)}>+</Button>
                </View>
            </View>

            {/* Job Post Counter */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <CText sx={{ fontSize: 18 }}>Job Posts:</CText>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Button mode="contained-tonal" onPress={() => setJobPosts(Math.max(1, jobPosts - 1))}>-</Button>
                    <CText sx={{ fontSize: 18, marginHorizontal: 10 }}>{jobPosts}</CText>
                    <Button mode="contained-tonal" onPress={() => setJobPosts(jobPosts + 1)}>+</Button>
                </View>
            </View>

            <Divider style={{ marginVertical: 10 }} />

            <CText sx={{ fontSize: 16, marginBottom: 5 }} fontWeight={600}>🎯 Discount Structure:</CText>
            <CText sx={{ fontSize: 14, color: "gray" }}>✅ 5% off on ₹500+</CText>
            <CText sx={{ fontSize: 14, color: "gray" }}>✅ 10% off on ₹1000+</CText>
            <CText sx={{ fontSize: 14, color: "gray" }}>✅ 20% off on ₹5000+</CText>

            <Divider style={{ marginVertical: 10 }} />

            <CText sx={{ fontSize: 18, textAlign: "center", marginVertical: 5 }}>
                Total Price: <CText sx={{ textDecorationLine: discount ? "line-through" : "none" }}>₹{totalPrice}</CText>
            </CText>

            {discount > 0 && (
                <CText sx={{ fontSize: 16, textAlign: "center", color: "green" }} fontWeight={600}>
                    🎉 {discount * 100}% Discount Applied! (-₹{discountAmount.toFixed(2)})
                </CText>
            )}

            <CText sx={{ fontSize: 20, textAlign: "center", marginVertical: 10 }} fontWeight={600}>
                Final Price: ₹{finalPrice.toFixed(2)}
            </CText>

            <Button mode="contained" onPress={() => handlePayment(id, finalPrice.toFixed(0))} style={{ marginTop: 10 }}>
                Subscribe Now
            </Button>
        </Card>
    );
};

export default CCustomizeSubscriptionCard;