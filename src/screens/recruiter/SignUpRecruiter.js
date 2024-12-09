import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { createRecruiter, updateRecruiter } from '../../services/AuthService';  // Adjust path for your service
import axios from 'axios';
import CustomImageUploader from '../../components/CimageUploader';
import { getUserData } from '../../services/UserDataService';
import CText from '../../components/CText';

// Validation Schema
const validationSchema = Yup.object().shape({
    recruiter_name: Yup.string()
        .required('Recruiter Name is required')
        .min(3, 'Recruiter Name must be at least 3 characters long')
        .matches(/^[a-zA-Z\s]+$/, 'Username must contain only letters.'),
        recruiter_email: Yup.string().matches(
            /^[^@]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            'Invalid Email'
          )
          .test('only-one-dot', 'Invalid Email', (value) => {
            // Check if the email contains exactly one dot after the '@'
            const dotCount = (value.match(/\./g) || []).length;
            return dotCount === 1;
          })
          .required('Email is required.'),
    recruiter_password: Yup.string()
        .required('Recruiter Password is required')
        .min(8, 'Password must be at least 8 characters'),
    recruiter_phone: Yup.string()
        .required('Phone Number is required')
        .matches(/^[6-9][0-9]{9}$/, "Phone number is not valid"),
    recruiter_description: Yup.string()
        .required('Recruiter Description is required')
        .max(200, 'Description cannot exceed 200 characters'),
    company_email_id: Yup.string()
    .matches(
        /^[^@]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        'Invalid Email'
      )
      .test('only-one-dot', 'Invalid Email', (value) => {
        // Check if the email contains exactly one dot after the '@'
        const dotCount = (value.match(/\./g) || []).length;
        return dotCount === 1;
      })
        .optional(), // email is optional
    recruiter_image: Yup.string().required('Profile Image is required'),
});

const SignUpRecruiter = () => {
    const navigation = useNavigation();
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [secureTextEntryC, setSecureTextEntryC] = useState(true);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null)
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        // Define an async function inside the useEffect
        const fetchData = async () => {
            try {
                const data = await getUserData();
                setUserData(data)
                console.log(data); // Log the data
                setIsDataLoaded(true);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsDataLoaded(true);
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

    const handleSubmit = async (values, { setFieldValue }) => {
        console.log(values)
        if(userData){
            try {
                delete values["company_password"]
                const response = await updateRecruiter(values);
                if (response?.message === "Data updated successfully") {
                    Alert.alert('Success', 'Data updated successfully!');
                    navigation.navigate('Bottom Navigation Recruiter');
                    return
                }
                Alert.alert('Failed', 'Try Again Later!');
                console.log(response);
            } catch (error) {
                Alert.alert('Error', 'There was an issue while submitting the form. Please try again.');
            }
            return
        }

        if (values.company_email_id !== "" && values.company_password === "") {
            return
        }
        console.log(values)
        try {
            delete values["id"]
            const response = await createRecruiter(values);
            if (response === "Company email id and/or Company Password is wrong") {
                setFieldValue("company_email_id", "")
                setFieldValue("company_password", "")
                Alert.alert('Failed', 'Company email id and/or Company Password is wrong!');
                return
            }
            Alert.alert('Success', 'Recruiter Registration Successful!');
            navigation.navigate('Bottom Navigation Recruiter');
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
                    <CText fontWeight={600} sx={styles.heading}>{userData ? "Edit" : "Sign Up"} - Recruiter</CText>

                    <Formik
                        initialValues={{
                            id: userData?.recruiter_id || '',
                            recruiter_name: userData?.recruiter_name || '',
                            recruiter_email: userData?.recruiter_email || '',
                            recruiter_password: userData?.recruiter_password || '',
                            recruiter_phone: userData?.recruiter_phone || '',
                            recruiter_description: userData?.recruiter_description || '',
                            company_email_id: userData?.company_email_id || '',
                            company_password: userData?.company_password || '',
                            recruiter_image: userData?.recruiter_image || '', // Make sure this is initialized as an empty string
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, touched }) => (
                            <View style={styles.formContainer}>
                                {/* Recruiter Id */}
                                {userData && <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Recruiter Id"
                                        style={styles.input}
                                        disabled={true}
                                        value={values.id}
                                        onChangeText={handleChange('id')}
                                        onBlur={handleBlur('id')}
                                        mode="outlined"
                                    />
                                </View>}
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
                                    <ErrorMessage name="recruiter_name" component={CText} sx={styles.errorMessage} />
                                </View>
                                {/* Recruiter Email */}
                                <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Recruiter Email"
                                        style={styles.input}
                                        disabled={userData}
                                        value={values.recruiter_email}
                                        onChangeText={handleChange('recruiter_email')}
                                        onBlur={handleBlur('recruiter_email')}
                                        mode="outlined"
                                        keyboardType="email-address"
                                    />
                                    <ErrorMessage name="recruiter_email" component={CText} sx={styles.errorMessage} />
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
                                    <ErrorMessage name="recruiter_password" component={CText} sx={styles.errorMessage} />
                                </View>
                                {/* Recruiter Phone */}
                                <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Recruiter Phone No."
                                        style={styles.input}
                                        value={values.recruiter_phone}
                                        onChangeText={(e)=>{
                                            if (/^\d*$/.test(e) && e.length <= 10) {
                                                setFieldValue('recruiter_phone', e);
                                            }
                                        }}
                                        onBlur={handleBlur('recruiter_phone')}
                                        mode="outlined"
                                        keyboardType="phone-pad"
                                    />
                                    <ErrorMessage name="recruiter_phone" component={CText} sx={styles.errorMessage} />
                                </View>
                                {/* Company Email (Optional) */}
                                <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Company Email ID (Optional)"
                                        style={styles.input}
                                        disabled={userData}
                                        value={values.company_email_id}
                                        onChangeText={handleChange('company_email_id')}
                                        onBlur={handleBlur('company_email_id')}
                                        mode="outlined"
                                        keyboardType="email-address"
                                    />
                                    <ErrorMessage name="company_email_id" component={CText} sx={styles.errorMessage} />
                                </View>
                                {/* Company Password (Conditional) */}
                                {values.company_email_id && !userData && (
                                    <View style={{ marginBottom: 6 }}>
                                        <TextInput
                                            label="Company Password"
                                            style={styles.input}
                                            value={values.company_password}
                                            onChangeText={handleChange('company_password')}
                                            onBlur={handleBlur('company_password')}
                                            mode="outlined"
                                            secureTextEntry={secureTextEntryC}
                                            right={<TextInput.Icon icon={secureTextEntryC ? "eye-off" : "eye"} onPress={() => setSecureTextEntryC(!secureTextEntryC)} />}
                                        />
                                        {touched.company_password && !values.company_password?.length && <CText sx={styles.errorMessage}>Company Password is required</CText>}
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
                                    <ErrorMessage name="recruiter_description" component={CText} sx={styles.errorMessage} />
                                </View>
                                {/* Profile Image Uploader */}
                                <CustomImageUploader
                                    setFieldValue={setFieldValue}
                                    fieldKey="recruiter_image"
                                    values={values}
                                    placeholder={"Select Profile Image"}
                                />
                                <ErrorMessage name="recruiter_image" component={CText} sx={styles.errorMessage} />
                                {/* Submit Button */}
                                <Button
                                    mode="contained"
                                    onPress={() => handleSubmit(values, setFieldValue)}
                                    disabled={loading}
                                    style={styles.submitButton}
                                >
                                    {loading ? 'Submitting...' : userData ? 'Save' : 'Sign Up'}
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
        // paddingLeft: 10,
        marginTop: 20,
    },
    backButtonLabel: {
        color: 'black',
    },
    heading: {
        fontSize: 24,
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
        backgroundColor: "black"
    },
});

export default SignUpRecruiter;
