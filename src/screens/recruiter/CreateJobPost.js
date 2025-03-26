import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Dropdown } from 'react-native-paper-dropdown';
import { Provider as PaperProvider } from 'react-native-paper';
import { TextInput, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { Formik, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import CText from '../../components/CText';
import { getUserData } from '../../services/UserDataService';
import { createJobPost } from '../../services/JobPostService';

// Validation Schema
const validationSchema = Yup.object().shape({
    job_post_name: Yup.string().required('Job name is required').max(45, 'Max length is 45 characters'),
    job_post_description: Yup.string().required('Description is required'),
    job_post_salary: Yup.string().required('Salary is required').max(45, 'Max length is 45 characters'),
    job_post_location: Yup.string().required('Location is required').max(45, 'Max length is 45 characters'),
    job_post_experience_level: Yup.string().oneOf(['Experience', 'Fresher', 'Intern'], 'Invalid Experience Level').required('Experience level is required'),
    job_post_employment_type: Yup.string().oneOf(['Full Time', 'Part Time'], 'Invalid Employment Type').required('Employment type is required'),
    job_post_responsibility: Yup.array().of(Yup.string().required('Responsibility is required')),
    job_post_requirement: Yup.array().of(Yup.string().required('Requirement is required')),
});

const JobPostForm = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [userData, setUserDate] = useState();
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const OPTIONS_EMPLOYMENT_TYPE = [
        { label: 'Full Time', value: 'Full Time' },
        { label: 'Part Time', value: 'Part Time' },
    ];
    const OPTIONS_EXPERIENCE_LEVEL = [
        { label: 'Experience', value: 'Experience' },
        { label: 'Fresher', value: 'Fresher' },
        { label: 'Intern', value: 'Intern' },
    ];

    useEffect(() => {
        // Define an async function inside the useEffect
        const fetchData = async () => {
            try {
                const data = await getUserData();
                setUserDate(data)
                console.log(data);
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

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            let data = await createJobPost(values)
            // Handle form submission here (e.g., send the data to an API)
            console.log('Form Data:', values);
            Alert.alert('Success', 'Job Post Created Successfully!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'There was an issue submitting the form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PaperProvider>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.container}>

                    <View>
                        <Formik
                            initialValues={{
                                job_post_name: '',
                                job_post_description: '',
                                job_post_salary: '',
                                job_post_location: '',
                                job_post_experience_level: '',
                                job_post_employment_type: '',
                                job_post_responsibility: [''],
                                job_post_requirement: [''],
                                recruiter_id: userData?.recruiter_id,
                                company_id: userData?.company_email_id,
                                is_deleted: "False"
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ handleChange, handleBlur, errors, handleSubmit, values, setFieldValue }) => (
                                <View style={styles.formContainer}>
                                    {/* Job Name */}
                                    <TextInput
                                        label="Job Name"
                                        style={styles.input}
                                        value={values.job_post_name}
                                        onChangeText={handleChange('job_post_name')}
                                        onBlur={handleBlur('job_post_name')}
                                        mode="outlined"
                                    />
                                    <ErrorMessage sx={{ marginLeft: 16 }} name="job_post_name" component={CText} fontSize={12} color={"red"} />

                                    {/* Job Description */}
                                    <TextInput
                                        label="Job Description"
                                        style={styles.input}
                                        value={values.job_post_description}
                                        onChangeText={handleChange('job_post_description')}
                                        onBlur={handleBlur('job_post_description')}
                                        mode="outlined"
                                        multiline
                                    />
                                    <ErrorMessage sx={{ marginLeft: 16 }} name="job_post_description" component={CText} fontSize={12} color={"red"} />

                                    {/* Job Salary */}
                                    <TextInput
                                        label="Job Salary"
                                        style={styles.input}
                                        value={values.job_post_salary}
                                        onChangeText={handleChange('job_post_salary')}
                                        onBlur={handleBlur('job_post_salary')}
                                        mode="outlined"
                                    />
                                    <ErrorMessage sx={{ marginLeft: 16 }} name="job_post_salary" component={CText} fontSize={12} color={"red"} />

                                    {/* Job Location */}
                                    <TextInput
                                        label="Job Location"
                                        placeholder='City, State'
                                        style={styles.input}
                                        value={values.job_post_location}
                                        onChangeText={handleChange('job_post_location')}
                                        onBlur={handleBlur('job_post_location')}
                                        mode="outlined"
                                    />
                                    <ErrorMessage sx={{ marginLeft: 16 }} name="job_post_location" component={CText} fontSize={12} color={"red"} />

                                    {/* Experience Level */}
                                    <View style={{ margin: 16 }}>
                                        <Dropdown
                                            label="Experience Level"
                                            name="job_post_experience_level"
                                            placeholder="Select Experience Level"
                                            options={OPTIONS_EXPERIENCE_LEVEL}
                                            value={values.job_post_experience_level}
                                            onSelect={(value) => { setFieldValue('job_post_experience_level', value) }}
                                            mode={"outlined"}
                                        />
                                        <ErrorMessage name="job_post_experience_level" component={CText} fontSize={12} color={"red"} />
                                    </View>

                                    {/* Employment Type */}
                                    <View style={{ marginHorizontal: 16 }}>
                                        <Dropdown
                                            label="Employment Type"
                                            name="job_post_employment_type"
                                            placeholder="Select Employment Type"
                                            options={OPTIONS_EMPLOYMENT_TYPE}
                                            value={values.job_post_employment_type}
                                            onSelect={(value) => { setFieldValue('job_post_employment_type', value) }}
                                            mode={"outlined"}
                                        />
                                        <ErrorMessage name="job_post_employment_type" component={CText} fontSize={12} color={"red"} />
                                    </View>
                                    {/* Responsibilities */}
                                    <FieldArray
                                        name="job_post_responsibility"
                                        render={(arrayHelpers) => (
                                            <View style={{ marginHorizontal: 16 }}>
                                                {values.job_post_responsibility.map((responsibility, index) => (
                                                    <View key={index} style={styles.responsibilityContainer}>
                                                        <TextInput
                                                            label={`Role & Responsibility ${index + 1}`}
                                                            value={responsibility}
                                                            onChangeText={handleChange(`job_post_responsibility[${index}]`)}
                                                            mode="outlined"
                                                        />
                                                        {index > 0 && <IconButton
                                                            icon="delete"
                                                            size={20}
                                                            onPress={() => arrayHelpers.remove(index)}
                                                            style={styles.deleteIcon}
                                                        />}
                                                        <ErrorMessage name={`job_post_responsibility[${index}]`} component={CText} fontSize={12} color={"red"} />
                                                    </View>
                                                ))}
                                                <Button
                                                    mode="outlined"
                                                    textColor='black'
                                                    onPress={() => arrayHelpers.push('')}
                                                    style={styles.addButton}
                                                >
                                                    Add Responsibility
                                                </Button>
                                            </View>
                                        )}
                                    />

                                    {/* Requirements */}
                                    <FieldArray
                                        name="job_post_requirement"
                                        render={(arrayHelpers) => (
                                            <View style={{ marginHorizontal: 16 }}>
                                                {values.job_post_requirement.map((requirement, index) => (
                                                    <View key={index} style={styles.requirementContainer}>
                                                        <TextInput
                                                            label={`Requirement ${index + 1}`}
                                                            value={requirement}
                                                            onChangeText={handleChange(`job_post_requirement[${index}]`)}
                                                            mode="outlined"
                                                        />
                                                        {index > 0 && <IconButton
                                                            icon="delete"
                                                            size={20}
                                                            onPress={() => arrayHelpers.remove(index)}
                                                            style={styles.deleteIcon}
                                                        />}
                                                        <ErrorMessage name={`job_post_requirement[${index}]`} component={CText} fontSize={12} color={"red"} />
                                                    </View>
                                                ))}
                                                <Button
                                                    mode="outlined"
                                                    textColor='black'
                                                    onPress={() => arrayHelpers.push('')}
                                                    style={styles.addButton}
                                                >
                                                    Add Requirement
                                                </Button>
                                            </View>
                                        )}
                                    />

                                    {/* Submit Button */}
                                    <Button mode="contained" style={styles.submitButton} onPress={handleSubmit}>
                                        {loading ? <ActivityIndicator color="#fff" /> : 'Create Job Post'}
                                    </Button>
                                </View>
                            )}
                        </Formik>
                    </View>
                    <View style={{ height: 120 }}></View>
                </ScrollView>
            </KeyboardAvoidingView>
        </PaperProvider>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    heading: {
        textAlign: 'center',
        fontSize: 24,
        marginTop: 10,
        fontWeight: 'bold',
    },
    backButton: {
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
        backgroundColor: 'white',
        color: 'black',
    },
    error: {
        color: 'red',
        marginLeft: 16,
        fontSize: 12,
    },
    submitButton: {
        borderRadius: 5,
        marginHorizontal: 16,
        marginTop: 20,
        backgroundColor: 'black',
        alignItems: 'center',
    },
    responsibilityContainer: {
        marginVertical: 10,
    },
    requirementContainer: {
        marginVertical: 10,
    },
    deleteIcon: {
        position: 'absolute',
        right: 0,
        top: 10,
    },
    addButton: {
        marginTop: 10,
        // marginHorizontal: 16,
    },
});

export default JobPostForm;
