import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { createRecruiter } from '../../services/AuthService';  // Adjust path for your service
import axios from 'axios';
import CustomImageUploader from '../../components/CimageUploader';

// Validation Schema
const validationSchema = Yup.object().shape({
    recruiter_name: Yup.string()
        .required('Recruiter Name is required')
        .min(3, 'Recruiter Name must be at least 3 characters long'),
    recruiter_email: Yup.string()
        .email('Invalid email format')
        .required('Recruiter Email is required'),
    recruiter_password: Yup.string()
        .required('Recruiter Password is required')
        .min(6, 'Password must be at least 6 characters'),
    recruiter_phone: Yup.string()
        .required('Phone Number is required')
        .matches(/^[6-9][0-9]{9}$/, "Phone number is not valid"),
    recruiter_description: Yup.string()
        .required('Recruiter Description is required')
        .max(200, 'Description cannot exceed 200 characters'),
    company_email_id: Yup.string()
        .email('Invalid email format')
        .optional(), // email is optional
    recruiter_image: Yup.string().required('Profile Image is required'),
});

const SignUpRecruiter = () => {
    const navigation = useNavigation();
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values, {setFieldValue}) => {
        console.log(values)
        if(values.company_email_id !== "" && values.company_password === ""){
            return
        }
        console.log(values)
        try {
            const response = await createRecruiter(values);
            if(response === "Company email id and/or Company Password is wrong"){
                setFieldValue("company_email_id","")
                setFieldValue("company_password","")
                Alert.alert('Failed', 'Company email id and/or Company Password is wrong!');
                return
            }
            Alert.alert('Success', 'Recruiter Registration Successful!');
            navigation.navigate('Bottom Navigation App');
            console.log(response);
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
                    <Text style={styles.heading}>Sign Up - Recruiter</Text>

                    <Formik
                        initialValues={{
                            recruiter_name: '',
                            recruiter_email: '',
                            recruiter_password: '',
                            recruiter_phone: '',
                            recruiter_description: '',
                            company_email_id: '',
                            company_password: '',
                            recruiter_image: '', // Make sure this is initialized as an empty string
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, touched }) => (
                            <View style={styles.formContainer}>
                                {/* Recruiter Name */}
                                <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Recruiter Name"
                                        style={styles.input}
                                        value={values.recruiter_name}
                                        onChangeText={handleChange('recruiter_name')}
                                        onBlur={handleBlur('recruiter_name')}
                                        mode="outlined"
                                    />
                                    <ErrorMessage name="recruiter_name" component={Text} style={styles.errorMessage} />
                                </View>
                                {/* Recruiter Email */}
                                <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Recruiter Email"
                                        style={styles.input}
                                        value={values.recruiter_email}
                                        onChangeText={handleChange('recruiter_email')}
                                        onBlur={handleBlur('recruiter_email')}
                                        mode="outlined"
                                        keyboardType="email-address"
                                    />
                                    <ErrorMessage name="recruiter_email" component={Text} style={styles.errorMessage} />
                                </View>
                                {/* Recruiter Password */}
                                <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Recruiter Password"
                                        style={styles.input}
                                        value={values.recruiter_password}
                                        onChangeText={handleChange('recruiter_password')}
                                        onBlur={handleBlur('recruiter_password')}
                                        mode="outlined"
                                        secureTextEntry={secureTextEntry}
                                        right={<TextInput.Icon icon={secureTextEntry ? "eye-off" : "eye"} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
                                    />
                                    <ErrorMessage name="recruiter_password" component={Text} style={styles.errorMessage} />
                                </View>
                                {/* Recruiter Phone */}
                                <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Recruiter Phone No."
                                        style={styles.input}
                                        value={values.recruiter_phone}
                                        onChangeText={handleChange('recruiter_phone')}
                                        onBlur={handleBlur('recruiter_phone')}
                                        mode="outlined"
                                        keyboardType="phone-pad"
                                    />
                                    <ErrorMessage name="recruiter_phone" component={Text} style={styles.errorMessage} />
                                </View>
                                {/* Company Email (Optional) */}
                                <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Company Email ID (Optional)"
                                        style={styles.input}
                                        value={values.company_email_id}
                                        onChangeText={handleChange('company_email_id')}
                                        onBlur={handleBlur('company_email_id')}
                                        mode="outlined"
                                        keyboardType="email-address"
                                    />
                                    <ErrorMessage name="company_email_id" component={Text} style={styles.errorMessage} />
                                </View>
                                {/* Company Password (Conditional) */}
                                {values.company_email_id && (
                                    <View style={{ marginBottom: 6 }}>
                                        <TextInput
                                            label="Company Password"
                                            style={styles.input}
                                            value={values.company_password}
                                            onChangeText={handleChange('company_password')}
                                            onBlur={handleBlur('company_password')}
                                            mode="outlined"
                                            secureTextEntry={secureTextEntry}
                                            right={<TextInput.Icon icon={secureTextEntry ? "eye-off" : "eye"} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
                                        />
                                        {touched.company_password && !values.company_password?.length && <Text style={styles.errorMessage}>Company Password is required</Text>}
                                        {/* <ErrorMessage name="company_password" component={Text} style={styles.errorMessage} /> */}
                                    </View>
                                )}
                                {/* Recruiter Description */}
                                <View style={{ marginBottom: 12 }}>
                                    <TextInput
                                        label="Recruiter Description"
                                        style={styles.input}
                                        value={values.recruiter_description}
                                        onChangeText={handleChange('recruiter_description')}
                                        onBlur={handleBlur('recruiter_description')}
                                        mode="outlined"
                                        multiline
                                    />
                                    <ErrorMessage name="recruiter_description" component={Text} style={styles.errorMessage} />
                                </View>
                                {/* Profile Image Uploader */}
                                <CustomImageUploader
                                    setFieldValue={setFieldValue}
                                    fieldKey="recruiter_image"
                                    values={values}
                                    placeholder={"Select Profile Image"}
                                />
                                <ErrorMessage name="recruiter_image" component={Text} style={styles.errorMessage} />
                                {/* Submit Button */}
                                <Button
                                    mode="contained"
                                    onPress={()=>handleSubmit(values, setFieldValue)}
                                    disabled={loading}
                                    style={styles.submitButton}
                                >
                                    {loading ? 'Submitting...' : 'Sign Up'}
                                </Button>
                            </View>
                        )}
                    </Formik>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 30,
        flexGrow: 1,
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    formContainer: {
        paddingVertical: 20,
    },
    input: {
        backgroundColor: 'transparent',
    },
    errorMessage: {
        color: 'red',
        fontSize: 12,
    },
    submitButton: {
        marginTop: 12,
        marginBottom: 30,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor:"black"
    },
});

export default SignUpRecruiter;
