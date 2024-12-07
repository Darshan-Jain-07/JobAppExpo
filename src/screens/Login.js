import { View, Text, Dimensions, StyleSheet, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Menu, Divider, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import { Dropdown } from 'react-native-paper-dropdown';
import { Provider as PaperProvider } from 'react-native-paper';
import * as Yup from 'yup';
import { ErrorMessage, Formik } from 'formik';
import { logIn } from '../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const validationSchema = Yup.object().shape({
    role: Yup.string().required('Role is required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
});

const initialValues = {
    role: "",
    email: "",
    password: ""
}

const OPTIONS = [
    { label: 'Job Seeker', value: 'applicant' },
    { label: 'Recruiter', value: 'recruiter' },
    { label: 'Company', value: 'company' },
];

const Login = () => {
    const navigation = useNavigation();
    function handleBack() {
        navigation.navigate('Get Started')
    }
    async function handleSubmit(values) {
        let response = await logIn(values.role, values.email, values.password)
        if (!response.length) {
            Alert.alert('Failed', 'Incorrect Credentials!');
        } else {
            await AsyncStorage.setItem('user', JSON.stringify({...response?.[0], role:values.role}));
            // await AsyncStorage.setItem('role', values.role);
            navigation.navigate('Bottom Navigation App')
        }
    }
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);

    return (
        <PaperProvider>
            <View>
                <Button
                    mode="text"
                    icon="keyboard-backspace"
                    onPress={handleBack}
                    style={{ display: "flex", alignItems: "flex-start", paddingLeft: 10, marginTop:20 }}
                    labelStyle={{ color: 'black' }} // Use labelStyle for text color
                >
                    Back
                </Button>
                <Text style={{ fontSize: 25, color: "#000", textAlign: "center", marginTop: 5, fontFamily: "Montserrat-Bold" }}>Login</Text>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ handleChange, handleBlue, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <View>
                            <View style={{ margin: 16 }}>
                                <Dropdown
                                    label="Role"
                                    name="role"
                                    placeholder="Select Role"
                                    options={OPTIONS}
                                    value={values.role}
                                    onSelect={(value) => { setFieldValue('role', value) }}
                                    mode={"outlined"}
                                />
                                <ErrorMessage name="role" component={Text} style={{ color: 'red' }} />
                            </View>
                            <View >
                                <TextInput
                                    label="Email"
                                    style={{ marginHorizontal: 16 }}
                                    value={values.email}
                                    onChangeText={text => setFieldValue('email', text)}
                                    mode='outlined'
                                />
                                <ErrorMessage name="email" component={Text} style={{ color: 'red', marginLeft: 16 }} />
                            </View>
                            <TextInput
                                label="Password"
                                style={{ marginHorizontal: 16, marginTop: 16 }}
                                value={values.password}
                                secureTextEntry={secureTextEntry}
                                onChangeText={pass => setFieldValue('password', pass)}
                                mode='outlined'
                                right={<TextInput.Icon icon={secureTextEntry ? "eye-off" : "eye"} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
                            />
                            <ErrorMessage name='password' component={Text} style={{ color: 'red', marginLeft: 16 }} />
                            <View style={{marginHorizontal:16}}>
                                <Button style={{ borderRadius: 5 }} marginTop={20} mode="contained" buttonColor={"black"} onPress={handleSubmit}>
                                    Login
                                </Button>
                            </View>
                        </View>
                    )}

                </Formik>
            </View>
        </PaperProvider>
    )
}

export default Login;