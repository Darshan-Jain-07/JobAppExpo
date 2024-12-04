import React, { useState } from 'react';
import { TouchableOpacity, Text, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const CustomImageUploader = ({ setFieldValue, fieldKey, values, uploadPreset = "jobApp", cloudName = "dwnqftgj0", placeholder }) => {
  const [loading, setLoading] = useState(null);
  const pickImage = async () => {
    // Request permissions to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access media library is required!');
      return;
    }

    // Open the image picker to allow the user to pick an image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypes,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setFieldValue(fieldKey, result.assets[0].uri);
      let img_url = await uploadImageToCloudinary(result.assets[0].uri);
      setFieldValue(fieldKey, img_url);
    }
  };

  const uploadImageToCloudinary = async (imageUri) => {
    if (!imageUri) return null;

    setLoading(true);

    const formData = new FormData();
    const fileType = imageUri.split(';')[0].split('/')[1];
    const fileName = `image.${fileType}`;

    const blob = await fetch(imageUri)
      .then((response) => response.blob())
      .catch((error) => {
        console.error('Error converting Base64 to Blob:', error);
        Alert.alert('Error', 'Failed to process the image.');
        setLoading(false);
        return null;
      });

    if (blob) {
      formData.append('file', blob);
      formData.append('upload_preset', uploadPreset);
      formData.append('cloud_name', cloudName);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        const cloudinaryUrl = response.data.secure_url;
        console.log('Image uploaded successfully:', cloudinaryUrl);
        Alert.alert('Success', 'Image uploaded successfully!');
        return cloudinaryUrl;
      } catch (error) {
        console.error('Upload failed:', error);
        Alert.alert('Upload failed', 'An error occurred while uploading the image.');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      Alert.alert('Error', 'Failed to convert the image.');
    }

    setLoading(false);
  };

  return (
    <TouchableOpacity onPress={pickImage} style={styles.logoPicker}>
      {values[fieldKey] ? (
        <Image source={{ uri: values[fieldKey] }} style={styles.logoImage} />
      ) : (
        <Text>{placeholder}</Text>
      )}
      {loading && <Text style={{ color: '#ff0000', marginHorizontal: 16 }}>Uploading...</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  }
});

export default CustomImageUploader;
