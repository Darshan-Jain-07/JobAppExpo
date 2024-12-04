import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // Using react-native-image-picker
import { Formik } from 'formik';
import * as Yup from 'yup';

const CreateBlogScreen = () => {
  const [image, setImage] = useState(null); // State to store selected image

  // Image picker handler using react-native-image-picker
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false, // Set true if you need base64 encoding of image
      },
      (response) => {
        if (response.didCancel) {
          console.log('User canceled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorCode);
        } else {
          setImage(response.assets[0].uri); // Get URI of the selected image
        }
      }
    );
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    topic: Yup.string().required('Topic is required').min(5, 'Topic must be at least 5 characters'),
    description: Yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
    image: Yup.mixed().required('Image is required').test(
      'fileSize',
      'The image is too large',
      (value) => value && value.size <= 5000000 // 5MB max size
    ),
  });

  // Form submission handler
  const handleSubmit = (values) => {
    console.log('Form Values:', values);
    Alert.alert('Blog Created', 'Your blog has been successfully created!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Blog</Text>

      <Formik
        initialValues={{ topic: '', description: '', image: null }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View style={styles.form}>
            {/* Topic */}
            <TextInput
              style={styles.input}
              placeholder="Enter Blog Topic"
              onChangeText={handleChange('topic')}
              onBlur={handleBlur('topic')}
              value={values.topic}
            />
            {errors.topic && touched.topic && <Text style={styles.errorText}>{errors.topic}</Text>}

            {/* Description */}
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter Blog Description"
              multiline
              numberOfLines={6}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
            />
            {errors.description && touched.description && <Text style={styles.errorText}>{errors.description}</Text>}

            {/* Image Upload */}
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Text style={styles.imagePickerText}>
                {image ? 'Change Image' : 'Pick an Image'}
              </Text>
            </TouchableOpacity>
            {image && (
              <View style={styles.selectedImageWrapper}>
                <Image source={{ uri: image }} style={styles.selectedImage} />
              </View>
            )}
            {errors.image && touched.image && <Text style={styles.errorText}>{errors.image}</Text>}

            {/* Submit Button */}
            <Button title="Submit Blog" onPress={handleSubmit} />
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
    fontWeight: 'bold',
    marginBottom: 20,
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
    marginBottom: 15,
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
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default CreateBlogScreen;
