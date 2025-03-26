import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker'; // Import expo-image-picker
import { useNavigation } from '@react-navigation/native';
import { createCompany, updateCompany } from '../../services/AuthService';
import axios from 'axios';
import CustomImageUploader from '../../components/CimageUploader';
import { getUserData } from '../../services/UserDataService';
import CText from '../../components/CText';
import { sendOtp, verifyOtp } from '../../services/EmailOtpService';

// Validation Schema
const validationSchema = Yup.object().shape({
    company_name: Yup.string()
        .required('Company Name is required')
        .min(2, 'Company Name must be at least 2 characters long'),
    company_email: Yup.string()
        .matches(
            /^[^@]+@[a-z0-9.-]+\.[a-z]{2,}$/,
            'Invalid Email'
        )
        .required('Email is required.'),
    company_password: Yup.string()
        .required('Company Password is required')  // Makes the password field required
        .min(8, 'Password must be at least 8 characters long')  // Ensures password is at least 8 characters long
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')  // Ensures at least one lowercase letter
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')  // Ensures at least one uppercase letter
        .matches(/[\W_]/, 'Password must contain at least one special symbol')  // Ensures at least one special character (non-alphanumeric)
        .matches(/[0-9]/, 'Password must contain at least one number'),  // Ensures at least one number (optional but good practice)
    company_phone: Yup.string()
        .required('Phone Number is required')
        .matches(/^[6-9][0-9]{9}$/, "Phone number is not valid"),
    company_description: Yup.string()
        .required('Company Description is required')
        .max(200, 'Description cannot exceed 200 characters'),
    company_logo: Yup.mixed().required('Company Logo is required'),
    company_recruiter_password: Yup.string()
        .required('Recruiter Password is required')  // Makes the password field required
        .min(8, 'Password must be at least 8 characters long')  // Ensures password is at least 8 characters long
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')  // Ensures at least one lowercase letter
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')  // Ensures at least one uppercase letter
        .matches(/[\W_]/, 'Password must contain at least one special symbol')  // Ensures at least one special character (non-alphanumeric)
        .matches(/[0-9]/, 'Password must contain at least one number'),  // Ensures at least one number (optional but good practice)
});

const SignUpCompany = () => {
    const navigation = useNavigation();
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [secureTextEntryR, setSecureTextEntryR] = useState(true);
    const [loading, setLoading] = useState(null);
    const [companyData, setCompanyData] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [emailOtp, setEmailOtp] = useState('');

    const handleSendEmailOtp = async (email) => {
        setEmailOtpSent(false);
        let d = await sendOtp({ email });
        console.log(d);
        setEmailOtpSent(true);
    };

    useEffect(() => {
        // Define an async function inside the useEffect
        const fetchData = async () => {
            try {
                const data = await getUserData();
                setCompanyData(data);
                console.log(data);
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
        if (companyData) {
            try {
                const response = await updateCompany(values);
                if (response?.message === "Duplicate entry error") {
                    Alert.alert('Error', 'Same email id already exist!');
                    return
                }
                Alert.alert('Success', 'Company Data Updated Successfully!');
                navigation.navigate('Bottom Navigation App');
                console.log(response);
            } catch (error) {
                Alert.alert('Error', 'There was an issue submitting the form. Please try again.');
            }
            return
        }
        try {
            delete values["id"]
            let verified = await verifyOtp({ email: values?.company_email, otp: emailOtp });
            console.log(verified)
            if (verified?.message === "OTP verified successfully!") {
                const response = await createCompany(values);
                if (response?.message === "Duplicate entry error") {
                    Alert.alert('Error', 'Same email id already exist!');
                    return
                }
                Alert.alert('Success', 'Company Registration Successful!');
                navigation.navigate('Bottom Navigation App');
                console.log(response);
            } else {
                Alert.alert('Error', 'Invalid OTP!');
            }
        } catch (error) {
            Alert.alert('Error', 'There was an issue submitting the form. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View>
                    <Button
                        mode="text"
                        icon="keyboard-backspace"
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        labelStyle={styles.backButtonLabel}
                    >
                        Back
                    </Button>
                    <CText fontWeight={600} sx={styles.heading}>{companyData ? "Edit" : "Sign Up"} - Company</CText>

                    <Formik
                        initialValues={{
                            id: companyData?.company_id || '',
                            company_name: companyData?.company_name || '',
                            company_email: companyData?.company_email || '',
                            company_password: companyData?.company_password || '',
                            company_phone: companyData?.company_phone || '',
                            company_description: companyData?.company_description || '',
                            company_logo: companyData?.company_logo || null, // Initial value for company logo is null
                            company_recruiter_password: companyData?.company_recruiter_password || '', // Initial value for recruiter password
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors }) => (
                            <View style={styles.formContainer}>
                                {/* Company Id */}
                                {companyData && <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Company Id"
                                        style={styles.input}
                                        disabled={true}
                                        value={values.id}
                                        onChangeText={handleChange('id')}
                                        onBlur={handleBlur('id')}
                                        mode="outlined"
                                    />
                                </View>}
                                {/* Company Name */}
                                <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Company Name"
                                        style={styles.input}
                                        value={values.company_name}
                                        onChangeText={handleChange('company_name')}
                                        onBlur={handleBlur('company_name')}
                                        mode="outlined"
                                    />
                                    <ErrorMessage name="company_name" component={CText} sx={styles.errorMessage} />
                                </View>
                                {/* Company Email */}
                                <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Company Email"
                                        style={styles.input}
                                        value={values.company_email}
                                        autoCapitalize='none'
                                        disabled={companyData ? true : false}
                                        onChangeText={handleChange('company_email')}
                                        onBlur={handleBlur('company_email')}
                                        mode="outlined"
                                        keyboardType="email-address"
                                    />
                                    <ErrorMessage name="company_email" component={CText} sx={styles.errorMessage} />
                                </View>
                                {/* Company Password */}
                                <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Company Password"
                                        style={styles.input}
                                        value={values.company_password}
                                        onChangeText={(e) => {
                                            const valueWithoutSpaces = e.replace(/\s/g, "");
                                            setFieldValue("company_password", valueWithoutSpaces);
                                        }}
                                        onBlur={handleBlur('company_password')}
                                        mode="outlined"
                                        secureTextEntry={secureTextEntry}
                                        right={<TextInput.Icon icon={secureTextEntry ? "eye-off" : "eye"} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
                                    />
                                    <ErrorMessage name="company_password" component={CText} sx={styles.errorMessage} />
                                </View>
                                {/* Recruiter Password */}
                                <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Recruiter Password"
                                        style={styles.input}
                                        value={values.company_recruiter_password}
                                        onChangeText={handleChange('company_recruiter_password')}
                                        onBlur={handleBlur('company_recruiter_password')}
                                        mode="outlined"
                                        secureTextEntry={secureTextEntryR}
                                        right={<TextInput.Icon icon={secureTextEntryR ? "eye-off" : "eye"} onPress={() => setSecureTextEntryR(!secureTextEntryR)} />}
                                    />
                                    <ErrorMessage name="company_recruiter_password" component={CText} sx={styles.errorMessage} />
                                    <CText sx={{ color: "#696969", marginHorizontal: 16, fontSize:12 }}>Note: Use a different password than the Company Password to protect access.</CText>
                                </View>
                                {/* Company Phone */}
                                <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Company Phone No."
                                        style={styles.input}
                                        value={values.company_phone}
                                        onChangeText={(e) => {
                                            if (/^\d*$/.test(e) && e.length <= 10) {
                                                setFieldValue('company_phone', e);
                                            }
                                        }}
                                        onBlur={handleBlur('company_phone')}
                                        mode="outlined"
                                        keyboardType="phone-pad"
                                    />
                                    <ErrorMessage name="company_phone" component={CText} sx={styles.errorMessage} />
                                </View>
                                {/* Company Description */}
                                <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Company Description (Max 200 characters)"
                                        style={styles.input}
                                        value={values.company_description}
                                        onChangeText={handleChange('company_description')}
                                        onBlur={handleBlur('company_description')}
                                        mode="outlined"
                                        multiline
                                        maxLength={200}
                                    />
                                    <ErrorMessage name="company_description" component={CText} sx={styles.errorMessage} />
                                </View>
                                {/* Company Logo */}
                                <View style={{ marginBottom: 6, marginHorizontal: 16, marginTop: 10 }}>
                                    <CustomImageUploader
                                        setFieldValue={setFieldValue}
                                        fieldKey="company_logo"
                                        values={values}
                                        placeholder={"Select Company Logo"}
                                    />
                                    <ErrorMessage name="company_logo" component={CText} color="#ff0000" fontSize={12} />
                                    {loading && <CText style={{ color: "#ff0000", marginHorizontal: 16 }}>Uploading...</CText>}
                                </View>
                                {(!Boolean(errors?.company_email)) && values?.company_email !== "" && companyData === null && (
                                    <Button
                                        mode="outlined"
                                        onPress={() => handleSendEmailOtp(values?.company_email)}
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
                                {/* Submit Button */}
                                <Button disabled={loading} mode="contained" style={styles.submitButton} onPress={handleSubmit}>
                                    {companyData ? "Save" : "Sign Up"}
                                </Button>
                            </View>
                        )}
                    </Formik>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, // Allows content to grow and scroll if needed
        // padding: 16,
    },
    backButton: {
        display: 'flex',
        alignItems: 'flex-start',
        paddingLeft: 10,
        marginTop: 20,
    },
    backButtonLabel: {
        color: 'black',
    },
    heading: {
        fontSize: 25,
        color: '#000',
        textAlign: 'center',
        marginTop: 5,
    },
    formContainer: {
        marginTop: 20,
    },
    input: {
        marginHorizontal: 16,
    },
    errorMessage: {
        color: 'red',
        marginLeft: 16,
        fontSize: 12
    },
    logoLabel: {
        fontSize: 16,
        color: '#000',
        marginBottom: 8,
    },
    logoPicker: {
        marginHorizontal: 16,
        borderWidth: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgray',
    },
    logoImage: {
        width: 100,
        height: 100,
    },
    submitButton: {
        borderRadius: 5,
        marginHorizontal: 16,
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: 'black',
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

export default SignUpCompany;
