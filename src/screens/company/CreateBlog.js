import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // Using react-native-image-picker
import { ErrorMessage, Formik } from 'formik';
import * as Yup from 'yup';
import CText from '../../components/CText';
import CustomImageUploader from '../../components/CimageUploader';
import { ActivityIndicator, Button } from 'react-native-paper';
import { getUserData } from '../../services/UserDataService';
import { useNavigation } from '@react-navigation/native';
import { createBlog } from '../../services/BlogService';

const CreateBlogScreen = () => {
  const [userData, setUserDate] = useState();
  const navigate = useNavigation();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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

  // Validation schema using Yup
  const validationSchema = Yup.object({
    blog_title: Yup.string()
      .required('Topic is required')
      .min(5, 'Topic must be at least 5 characters')
      .max(200, 'Topic must be less than 200 character'),
    blog_description: Yup.string()
      .required('Description is required')
      .min(20, 'Description must be at least 20 characters'),
    blog_image: Yup.mixed().required('Image is required'),
    // .test(
    //   'fileSize',
    //   'The image is too large',
    //   (value) => value && value.size <= 5000000 // 5MB max size
    // ),
  });

  // Form submission handler
  const handleSubmit = async (values) => {
    console.log('Form Values:', values);
    let response = await createBlog(values);
    console.log(response)
    Alert.alert('Blog Created', 'Your blog has been successfully created!');
    navigate.navigate('Home', { screen: 'Profile' })
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CText fontWeight={600} sx={styles.header}>Create Blog</CText>

      <Formik
        initialValues={{
          blog_title: '',
          blog_description: '',
          blog_image: null,
          created_by_id: userData?.role === "company" ? userData?.company_id : userData?.role === "applicant" ? userData?.applicant_id : userData?.role === "recruiter" ? userData?.recruiter_id : "",
          created_by_name: userData?.role === "company" ? userData?.company_name : userData?.role === "applicant" ? userData?.applicant_name : userData?.role === "recruiter" ? userData?.recruiter_name : "",
          blog_views: 0,
          blog_likes: 0,
          is_deleted: "false",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View style={styles.form}>
            {/* Topic */}
            <View style={{ marginBottom: 6 }}>
              <TextInput
                style={styles.input}
                placeholder="Enter Blog Topic"
                onChangeText={handleChange('blog_title')}
                onBlur={handleBlur('blog_title')}
                value={values.blog_title}
              />
              {errors.blog_title && touched.blog_title && <CText sx={styles.errorText}>{errors.blog_title}</CText>}
            </View>
            {/* Description */}
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter Blog Description"
              multiline
              numberOfLines={6}
              onChangeText={handleChange('blog_description')}
              onBlur={handleBlur('blog_description')}
              value={values.blog_description}
            />
            {errors.blog_description && touched.blog_description && <CText sx={styles.errorText}>{errors.blog_description}</CText>}

            {/* Image Upload */}
            <View style={{ marginVertical: 6 }}>
              <CustomImageUploader
                setFieldValue={setFieldValue}
                fieldKey="blog_image"
                values={values}
                placeholder={"Select Blog Image"}
              />
              <ErrorMessage name="blog_image" component={CText} color="#ff0000" fontSize={12} />
              {/* {loading && <CText style={{ color: "#ff0000", marginHorizontal: 16 }}>Uploading...</CText>} */}
            </View>
            <Button style={{ borderRadius: 5 }} marginTop={20} mode="contained" buttonColor={"black"} onPress={handleSubmit}>
              Submit Blog
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    color: '#333',
  },
  form: {
    marginTop: 20,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top', // Ensures text starts from the top of the TextInput
  },
  imagePicker: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedImageWrapper: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007BFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
  },
});

export default CreateBlogScreen;
