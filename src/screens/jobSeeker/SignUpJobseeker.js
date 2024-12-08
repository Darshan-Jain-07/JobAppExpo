import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { createApplicant, updateApplicant } from '../../services/AuthService';
import { getUserData } from '../../services/UserDataService';
import CText from '../../components/CText';

// Validation Schema
const validationSchema = Yup.object().shape({
    applicant_name: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long'),
    applicant_email: Yup.string().email('Invalid email format').required('Email is required'),
    applicant_phone: Yup.string()
        .required('Phone Number is required')
        .matches(/^[6-9][0-9]{9}$/, "Phone number is not valid"),
    applicant_password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const SignUpJobSeeker = () => {
    const navigation = useNavigation();
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [loading, setLoading] = useState(false);
    const [applicantData, setApplicantData] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        // Define an async function inside the useEffect
        const fetchData = async () => {
            try {
                const data = await getUserData();
                setApplicantData(data);
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
        if (applicantData) {
            try {
                const response = await updateApplicant(values);
                if (response?.message === "Duplicate entry error") {
                    Alert.alert('Error', 'Same email id already exist!');
                    return
                } 
                Alert.alert('Success', 'Job Seeker Data Updated Successfully!');
                navigation.navigate('Bottom Navigation Applicant');
                console.log(response);
            } catch (error) {
                Alert.alert('Error', 'There was an issue submitting the form. Please try again.');
            }
            return
        }
        try {
            delete values["id"]
            setLoading(true);
            let data = await createApplicant(values);
            console.log(data)
            if (data?.message === "Data inserted successfully") {
                Alert.alert('Success', 'Job Seeker Registration Successful!');
                navigation.navigate('Bottom Navigation Applicant');
            } else if (data?.message === "Duplicate entry error") {
                Alert.alert('Error', 'Email Id and/or Phone No. already exist!');
            } else {
                Alert.alert('Error', 'Try Again Later!');
            }
            // Send data to backend for registration
            console.log(values);
        } catch (error) {
            Alert.alert('Error', 'There was an issue submitting the form. Please try again.');
        } finally {
            setLoading(false);
        }
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
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                            <View style={styles.formContainer}>
                                {/* Id */}
                                {applicantData && <TextInput
                                    label="Id"
                                    style={styles.input}
                                    disabled={true}
                                    value={values.id}
                                    onChangeText={handleChange('id')}
                                    onBlur={handleBlur('id')}
                                    mode="outlined"
                                />}
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
                                    onChangeText={handleChange('applicant_phone')}
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
                                    onChangeText={handleChange('applicant_password')}
                                    onBlur={handleBlur('applicant_password')}
                                    mode="outlined"
                                    secureTextEntry={secureTextEntry}
                                    right={<TextInput.Icon icon={secureTextEntry ? "eye-off" : "eye"} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
                                />
                                <ErrorMessage name="applicant_password" component={CText} sx={styles.errorMessage} />

                                {/* Submit Button */}
                                <Button mode="contained" style={styles.submitButton} onPress={handleSubmit}>
                                    {loading ? "Loading..." : applicantData ? "Save" : "Sign Up" }
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
        flexGrow: 1,
        // padding: 16,
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
        color:"black",
    },
    formContainer: {
        marginTop: 20,
    },
    input: {
        marginHorizontal: 16,
        marginTop:6,
    },
    errorMessage: {
        color: 'red',
        marginLeft: 16,
        fontSize:12
    },
    submitButton: {
        borderRadius: 5,
        marginHorizontal: 16,
        marginTop: 20,
        backgroundColor:"black"
    },
});

export default SignUpJobSeeker;
