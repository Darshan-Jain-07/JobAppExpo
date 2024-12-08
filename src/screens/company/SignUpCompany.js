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

// Validation Schema
const validationSchema = Yup.object().shape({
    company_name: Yup.string()
        .required('Company Name is required')
        .min(3, 'Company Name must be at least 3 characters long'),
    company_email: Yup.string()
        .email('Invalid email format')
        .required('Company Email is required'),
    company_password: Yup.string()
        .required('Company Password is required')
        .min(6, 'Password must be at least 6 characters'),
    company_phone: Yup.string()
        .required('Phone Number is required')
        .matches(/^[6-9][0-9]{9}$/, "Phone number is not valid"),
    company_description: Yup.string()
        .required('Company Description is required')
        .max(200, 'Description cannot exceed 200 characters'),
    company_logo: Yup.mixed().required('Company Logo is required'),
    company_recruiter_password: Yup.string()
        .required('Recruiter Password is required')
        .min(6, 'Recruiter Password must be at least 6 characters'), // Recruiter password validation
});

const SignUpCompany = () => {
    const navigation = useNavigation();
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [secureTextEntryR, setSecureTextEntryR] = useState(true);
    const [loading, setLoading] = useState(null);
    const [companyData, setCompanyData] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

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
            const response = await createCompany(values);
            if (response?.message === "Duplicate entry error") {
                Alert.alert('Error', 'Same email id already exist!');
                return
            } 
            Alert.alert('Success', 'Company Registration Successful!');
            navigation.navigate('Bottom Navigation App');
            console.log(response);
        } catch (error) {
            Alert.alert('Error', 'There was an issue submitting the form. Please try again.');
        }
    };

    // const uploadImageToCloudinary = async (imageUri) => {
    //     console.log(imageUri);
    //     if (!imageUri) return;

    //     setLoading(true);
    //     console.log("hello");

    //     const formData = new FormData();
    //     const fileType = imageUri.split(';')[0].split('/')[1]; // Extract file type from data URI
    //     const fileName = `image.${fileType}`;

    //     // Convert Base64 to Blob
    //     const blob = await fetch(imageUri)
    //         .then((response) => response.blob())
    //         .catch((error) => {
    //             console.error('Error converting Base64 to Blob:', error);
    //             Alert.alert("Error", "Failed to process the image.");
    //             return null;
    //         });
    //     console.log(blob);

    //     if (blob) {
    //         formData.append('file', blob);
    //         formData.append('upload_preset', 'jobApp'); // Replace with your upload preset
    //         formData.append('cloud_name', 'dwnqftgj0'); // Replace with your cloud name

    //         try {
    //             const response = await axios.post(
    //                 'https://api.cloudinary.com/v1_1/dwnqftgj0/image/upload',
    //                 formData,
    //                 { headers: { 'Content-Type': 'multipart/form-data' } }
    //             );
    //             console.log('Response from Cloudinary:', response);

    //             const cloudinaryUrl = response.data.secure_url;
    //             console.log('Image uploaded successfully:', cloudinaryUrl);
    //             Alert.alert('Success', 'Image uploaded successfully!');
    //             return cloudinaryUrl;
    //         } catch (error) {
    //             console.error('Upload failed:', error);
    //             Alert.alert('Upload failed', 'An error occurred while uploading the image.');
    //         } finally {
    //             setLoading(false);
    //         }
    //     } else {
    //         setLoading(false);
    //         Alert.alert('Error', 'Failed to convert the image.');
    //     }
    // };

    // // Function to request image picker permissions and pick an image
    // const pickImage = async (setFieldValue, values) => {
    //     // Request permissions to access the media library
    //     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //     if (!permissionResult.granted) {
    //         Alert.alert('Permission required', 'Permission to access media library is required!');
    //         return;
    //     }

    //     // Open the image picker to allow the user to pick an image
    //     const result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaType,
    //         allowsEditing: true,
    //         quality: 0.5,
    //     });

    //     if (!result.canceled) {
    //         // Update Formik's company_logo field with the selected image URI
    //         setFieldValue('company_logo', result.assets[0].uri);
    //         let img_url = await uploadImageToCloudinary(result.assets[0].uri);
    //         setFieldValue('company_logo', img_url);
    //     }
    // };

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
                        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                            <View style={styles.formContainer}>
                                {/* Company Id */}
                                { companyData && <View style={{ marginBottom: 6 }}>
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
                                        onChangeText={handleChange('company_password')}
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
                                    <CText sx={{ color: "#696969", marginHorizontal: 16 }}>Note: Keep it different from Company Password else recruiter will have company access</CText>
                                    <ErrorMessage name="company_recruiter_password" component={CText} sx={styles.errorMessage} />
                                </View>
                                {/* Company Phone */}
                                <View style={{ marginBottom: 6 }}>
                                    <TextInput
                                        label="Company Phone No."
                                        style={styles.input}
                                        value={values.company_phone}
                                        onChangeText={handleChange('company_phone')}
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
                                <View style={{ marginBottom: 6, marginHorizontal: 16 }}>
                                    <CText style={styles.logoLabel}>Company Logo</CText>
                                    <CustomImageUploader
                                        setFieldValue={setFieldValue}
                                        fieldKey="company_logo"
                                        values={values}
                                        placeholder={"Select Logo"}
                                    />
                                    <ErrorMessage name="company_logo" component={CText} color="#ff0000" fontSize={12} />
                                    {loading && <CText style={{ color: "#ff0000", marginHorizontal: 16 }}>Uploading...</CText>}
                                </View>
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
});

export default SignUpCompany;
