import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { createApplicant, updateApplicant } from '../../services/AuthService';
import { getUserData } from '../../services/UserDataService';
import CText from '../../components/CText';
import { sendOtp, verifyOtp } from '../../services/EmailOtpService';

// Validation Schema
const validationSchema = Yup.object().shape({
    applicant_name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters long')
        .matches(/^[a-zA-Z\s]+$/, 'Username must contain only letters.'),
    applicant_email: Yup.string().matches(
        /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, // Updated to match lowercase letters only
        'Invalid Email'
    )
        // .test('only-one-dot', 'Invalid Email', (value) => {
        //     // Ensure there is exactly one dot after the '@'
        //     const dotCount = (value.match(/\./g) || []).length;
        //     const atSymbolIndex = value.indexOf('@');
        //     const substringAfterAt = value.substring(atSymbolIndex); // Get the substring after '@'

        //     return dotCount === 1 && substringAfterAt.indexOf('.') !== -1; // Ensure one dot after '@'
        // })
        .required('Email is required.'),
    // applicant_email: Yup.string()
    // .email('Invalid email address') // Standard email format validation
    // .required('Email is required') // Email field must be filled
    // .test('single-dot-after-at', 'There must be exactly one dot after "@"', (value) => {
    //   if (value) {
    //     // Split the string at '@'
    //     const parts = value.split('@');

    //     if (parts.length !== 2) return false; // Ensure exactly one '@'

    //     // Check if there's exactly one dot after the '@'
    //     const domain = parts[1]; // Get the domain part (after '@')
    //     const dotCount = domain.split('.').length - 1; // Count the dots in the domain

    //     return dotCount === 1; // Return true if exactly one dot after '@'
    //   }
    //   return false;
    // }),
    applicant_phone: Yup.string()
        .required('Phone Number is required')
        .matches(/^[6-9][0-9]{9}$/, "Phone number is not valid"),
    applicant_password: Yup.string()
        .required('Password is required')  // Makes the password field required
        .min(8, 'Password must be at least 8 characters long')  // Ensures password is at least 8 characters long
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')  // Ensures at least one lowercase letter
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')  // Ensures at least one uppercase letter
        .matches(/[\W_]/, 'Password must contain at least one special symbol')  // Ensures at least one special character (non-alphanumeric)
        .matches(/[0-9]/, 'Password must contain at least one number'),  // Ensures at least one number (optional but good practice)
});

const SignUpJobSeeker = () => {
    const navigation = useNavigation();
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [loading, setLoading] = useState(false);
    const [applicantData, setApplicantData] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [emailOtp, setEmailOtp] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [phoneOtpSent, setPhoneOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    useEffect(() => {
        // Define an async function inside the useEffect
        const fetchData = async () => {
            try {
                const data = await getUserData();
                setApplicantData(data);
                setIsDataLoaded(true); // Set data as loaded
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsDataLoaded(true); // Ensure form is displayed even if data fetch fails
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

    const handleSubmit = async (values) => {
        if (applicantData) {
            try {
                const response = await updateApplicant(values);
                if (response?.message === "Duplicate entry error") {
                    Alert.alert('Error', 'Same email id already exist!');
                    return;
                }
                Alert.alert('Success', 'Job Seeker Data Updated Successfully!');
                navigation.navigate('Bottom Navigation Applicant');
                console.log(response);
            } catch (error) {
                Alert.alert('Error', 'There was an issue submitting the form. Please try again.');
            }
            return;
        }
        try {
            delete values["id"];
            console.log(values)
            let verified = await verifyOtp({ email: values?.applicant_email, otp: emailOtp });
            console.log(verified)
            if (verified?.message === "OTP verified successfully!") {
                setLoading(true);
                console.log(values)
                let data = await createApplicant(values);
                console.log(data);
                if (data?.message === "Data inserted successfully") {
                    Alert.alert('Success', 'Job Seeker Registration Successful!');
                    navigation.navigate('Bottom Navigation Applicant');
                } else if (data?.message === "Duplicate entry error") {
                    Alert.alert('Error', 'Email Id and/or Phone No. already exist!');
                } else {
                    Alert.alert('Error', 'Try Again Later!');
                }
            } else {
                Alert.alert('Error', 'Invalid OTP!');
            }
            // Send data to backend for registration
            console.log(values);
        } catch (error) {
            Alert.alert('Error', 'There was an issue submitting the form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle OTP sending (simulated)
    const handleSendEmailOtp = async (email) => {
        setEmailOtpSent(false);
        let d = await sendOtp({ email });
        console.log(d);
        setEmailOtpSent(true);
    };

    const handleSendPhoneOtp = (phone) => {
        setOtpLoading(true);
        // Simulate OTP sending
        setTimeout(() => {
            setOtpLoading(false);
            setPhoneOtpSent(true);
            Alert.alert('Success', 'OTP sent to your phone!');
        }, 2000);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Button
                    mode="text"
                    icon="keyboard-backspace"
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    labelStyle={styles.backButtonLabel}
                >
                    Back
                </Button>
                <View>
                    <CText sx={styles.heading} fontWeight={600} fontSize={25}>{applicantData ? "Edit" : "Sign Up"} - Job Seeker</CText>

                    <Formik
                        initialValues={{
                            id: applicantData?.applicant_id,
                            applicant_name: applicantData?.applicant_name || '',
                            applicant_email: applicantData?.applicant_email || '',
                            applicant_phone: applicantData?.applicant_phone || '',
                            applicant_password: applicantData?.applicant_password || '',
                            is_deleted: 'false',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleChange, handleBlur, errors, handleSubmit, values, setFieldValue }) => (
                            <View style={styles.formContainer}>
                                {/* Name */}
                                <TextInput
                                    label="Name"
                                    style={styles.input}
                                    value={values.applicant_name}
                                    onChangeText={handleChange('applicant_name')}
                                    onBlur={handleBlur('applicant_name')}
                                    mode="outlined"
                                />
                                <ErrorMessage name="applicant_name" component={CText} color={"red"} sx={{ marginHorizontal: 16 }} />

                                {/* Email */}
                                <TextInput
                                    label="Email"
                                    style={styles.input}
                                    disabled={applicantData}
                                    value={values.applicant_email}
                                    autoCapitalize='none'
                                    onChangeText={handleChange('applicant_email')}
                                    onBlur={handleBlur('applicant_email')}
                                    mode="outlined"
                                    keyboardType="email-address"
                                />
                                <ErrorMessage name="applicant_email" component={CText} sx={styles.errorMessage} />

                                {/* Phone */}
                                <TextInput
                                    label="Phone Number"
                                    style={styles.input}
                                    value={values.applicant_phone}
                                    onChangeText={(e) => {
                                        if (/^\d*$/.test(e) && e.length <= 10) {
                                            setFieldValue('applicant_phone', e);
                                        }
                                    }}
                                    onBlur={handleBlur('applicant_phone')}
                                    mode="outlined"
                                    keyboardType="phone-pad"
                                />
                                <ErrorMessage name="applicant_phone" component={CText} sx={styles.errorMessage} />

                                {/* Password */}
                                <TextInput
                                    label="Password"
                                    style={styles.input}
                                    value={values.applicant_password}
                                    onChangeText={(e) => {
                                        const valueWithoutSpaces = e.replace(/\s/g, "");
                                        setFieldValue("applicant_password", valueWithoutSpaces);
                                    }}
                                    onBlur={handleBlur('applicant_password')}
                                    mode="outlined"
                                    secureTextEntry={secureTextEntry}
                                    right={<TextInput.Icon icon={secureTextEntry ? "eye-off" : "eye"} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
                                />
                                <ErrorMessage name="applicant_password" component={CText} sx={styles.errorMessage} />

                                {/* OTP Buttons */}
                                {(!Boolean(errors?.applicant_email)) && values?.applicant_email !== "" && !applicantData?.applicant_email && (
                                    <Button
                                        mode="outlined"
                                        onPress={() => handleSendEmailOtp(values?.applicant_email)}
                                        style={styles.otpButton}
                                    // disabled={!emailOtpSent}
                                    >
                                        <Text style={styles.otpButtonText}>
                                            {emailOtpSent ? "Resend Email OTP" : "Send Email OTP"}
                                        </Text>
                                    </Button>
                                )}

                                {emailOtpSent && (
                                    <TextInput
                                        label="Enter Email OTP"
                                        style={styles.input}
                                        mode="outlined"
                                        onChangeText={(e) => {
                                            if (/^\d*$/.test(e)) {
                                                setEmailOtp(e);
                                            }
                                        }}
                                        value={emailOtp}
                                        keyboardType="number-pad"
                                    />
                                )}

                                {emailOtpSent && (
                                    <Text style={styles.otpSentText}>OTP Sent to your email</Text>
                                )}

                                {/* <Button
                                    mode="outlined"
                                    onPress={() => handleSendPhoneOtp(values.applicant_phone)}
                                    style={styles.otpButton}
                                    disabled={phoneOtpSent || otpLoading}
                                >
                                    <Text style={styles.otpButtonText}>
                                        {phoneOtpSent ? "Resend Phone OTP" : "Send Phone OTP"}
                                    </Text>
                                </Button> */}

                                {/* {phoneOtpSent && (
                                    <TextInput
                                        label="Enter Phone OTP"
                                        style={styles.input}
                                        value={phoneOtp}
                                        onChangeText={setPhoneOtp}
                                        keyboardType="number-pad"
                                    />
                                )}

                                {phoneOtpSent && (
                                    <Text style={styles.otpSentText}>OTP Sent to your phone</Text>
                                )} */}

                                {/* Submit Button */}
                                <Button mode="contained" style={styles.submitButton} onPress={handleSubmit}>
                                    {loading ? "Loading..." : applicantData ? "Save" : "Sign Up"}
                                </Button>
                            </View>
                        )}
                    </Formik>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

// Updated styling
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    heading: {
        color: '#000',
        textAlign: 'center',
        marginTop: 5,
    },
    backButton: {
        display: 'flex',
        alignItems: 'flex-start',
        paddingLeft: 10,
        marginTop: 20,
    },
    backButtonLabel: {
        color: "black",
    },
    formContainer: {
        marginTop: 20,
    },
    input: {
        marginHorizontal: 16,
        marginTop: 6,
    },
    errorMessage: {
        color: 'red',
        marginLeft: 16,
        fontSize: 12,
    },
    submitButton: {
        borderRadius: 5,
        marginHorizontal: 16,
        marginTop: 20,
        backgroundColor: 'black',
        paddingVertical: 5,
        alignItems: 'center'
    },
    submitButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    otpButton: {
        borderRadius: 5,
        marginHorizontal: 16,
        marginTop: 10,
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    otpButtonText: {
        color: 'black',
        fontSize: 14,
        fontWeight: '500',
    },
    otpSentText: {
        color: 'green',
        fontSize: 12,
        marginTop: 5,
        textAlign: 'center',
    },
});

export default SignUpJobSeeker;
