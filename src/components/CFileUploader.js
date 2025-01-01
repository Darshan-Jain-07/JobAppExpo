import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { API_BASE_URL_RESUME_DATA_EXTRACTOR } from '@env';
import CText from './CText';

const CustomFileUploader = ({ setFieldValue, fieldKey, values, placeholder }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  // Function to pick a document
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });
    console.log(result.assets?.[0]);

    if (result) {
      setLoading(true);
      const { uri, name, mimeType } = result?.assets?.[0];
      console.log(`File selected: ${name}, ${mimeType}, ${uri}`);

      // Save file name in the form field
      setFieldValue(fieldKey, name);  // Store the file name instead of URI

      await uploadFile(uri, mimeType, name);
    }
  };

  // Function to upload file to the server
  const uploadFile = async (uri, mimeType, fileName) => {
    try {
      setFile(fileName)
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        name: fileName,
        type: mimeType,
      });
      formData.append('upload_preset', 'jobApp'); // Cloudinary preset
      formData.append('resource_type', 'raw');

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dwnqftgj0/upload`, 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
  
        // console.log(response)
        // Once the file is uploaded, you get the file URL
        const fileUrl = response?.data?.secure_url;
        setFieldValue('resume_file_url', fileUrl);
        setFieldValue('resume_file_name', file);
  
        // Now you can save the file URL in your database (here, just logging)
        console.log('File URL:', fileUrl);

  
        // Alert.alert('File uploaded successfully!');
      } catch (error) {
        console.error('Upload failed:', error);
        Alert.alert('Upload failed, please try again');
      } finally {
        // setUploading(false);
      }
      

      const response = await axios.post(`${API_BASE_URL_RESUME_DATA_EXTRACTOR}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      // Extracted data response from the server after file processing
      const extractedData = response.data;
      console.dir(extractedData, { depth: null })
      if (extractedData) {
        // Assuming extractedData contains form fields
        setFieldValue('resume_name', extractedData.fullname);
        // setFieldValue('resume_email', extractedData.email);
        setFieldValue('resume_linkedin', extractedData.linkedin);
        setFieldValue('resume_phone', extractedData.phone);
        setFieldValue('resume_address', extractedData.address);
        setFieldValue('resume_skills', extractedData.skills);
        setFieldValue('resume_language', extractedData.language);
        setFieldValue('resume_experience', extractedData.experience);
        setFieldValue('resume_project', extractedData.project);
        setFieldValue('resume_education', extractedData.education);
        setFieldValue('resume_hobby', extractedData.hobby);
      }

      setLoading(false);
      Alert.alert('Success', 'File uploaded and form fields populated.');
    } catch (error) {
      setLoading(false);
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'An error occurred while uploading the file.');
    }
  };

  return (
    <TouchableOpacity onPress={pickDocument} style={styles.filePicker}>
      {/* Check if file name is set, and display it */}
      {values?.resume_file_url ? (
        <CText style={styles.selectedText}>{values?.resume_file_name || file}</CText>
      ) : (
        <CText sx={styles.placeholder}>{placeholder}</CText>
      )}
      {loading && <CText sx={{ color: '#ff0000', marginHorizontal: 16 }}>Uploading...</CText>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filePicker: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
    marginBottom: 20,
  },
  selectedText: {
    fontSize: 16,
    color: 'black',
  },
  placeholder: {
    fontSize: 13,
    color: '#000',
  },
});

export default CustomFileUploader;
