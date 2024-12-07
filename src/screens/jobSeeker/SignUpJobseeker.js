import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { createApplicant } from '../../services/AuthService';

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
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            let data = await createApplicant(values);
            console.log(data)
            if (data?.message === "Data inserted successfully") {
                Alert.alert('Success', 'Job Seeker Registration Successful!');
                navigation.navigate('Bottom Navigation App');
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
                    <Text style={styles.heading}>Sign Up - Job Seeker</Text>

                    <Formik
                        initialValues={{
                            applicant_name: '',
                            applicant_email: '',
                            applicant_phone: '',
                            applicant_password: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
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
                                <ErrorMessage name="applicant_name" component={Text} style={styles.errorMessage} />

                                {/* Email */}
                                <TextInput
                                    label="Email"
                                    style={styles.input}
                                    value={values.applicant_email}
                                    onChangeText={handleChange('applicant_email')}
                                    onBlur={handleBlur('applicant_email')}
                                    mode="outlined"
                                    keyboardType="email-address"
                                />
                                <ErrorMessage name="applicant_email" component={Text} style={styles.errorMessage} />

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
                                <ErrorMessage name="applicant_phone" component={Text} style={styles.errorMessage} />

                                {/* Password */}
                                <TextInput
                                    label="Password"
                                    style={styles.input}
                                    value={values.applicant_password}
                                    onChangeText={handleChange('applicant_password')}
                                    onBlur={handleBlur('applicant_password')}
                                    mode="outlined"
                                    secureTextEntry
                                />
                                <ErrorMessage name="applicant_password" component={Text} style={styles.errorMessage} />

                                {/* Submit Button */}
                                <Button mode="contained" style={styles.submitButton} onPress={handleSubmit}>
                                    {loading ? "Loading..." : "Sign Up" }
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
        fontSize: 25,
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
    },
    submitButton: {
        borderRadius: 5,
        marginHorizontal: 16,
        marginTop: 20,
        backgroundColor:"black"
    },
});

export default SignUpJobSeeker;
