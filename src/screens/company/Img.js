import React, { useState } from 'react';
import { View, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function App() {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // Request permission to access image library
  const requestPermission = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      console.log("Permission granted");
    } else {
      Alert.alert("Permission required", "You need to grant permission to select images.");
    }
  };

  // Pick an image from the gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Check the URI and log it
      console.log('Selected Image URI:', result.assets[0].uri);
      setImageUri(result.assets[0].uri);
    }
  };

  // Upload the image to Cloudinary
  const uploadImageToCloudinary = async () => {
    if (!imageUri) return;
  
    setLoading(true);
  
    const formData = new FormData();
    const fileType = imageUri.split(';')[0].split('/')[1]; // Extract file type from data URI
    const fileName = `image.${fileType}`;
  
    // Convert Base64 to Blob
    const blob = await fetch(imageUri)
      .then((response) => response.blob())
      .catch((error) => {
        console.error('Error converting Base64 to Blob:', error);
        Alert.alert("Error", "Failed to process the image.");
        return null;
      });
      console.log(blob)
  
    if (blob) {
      formData.append('file', blob);
      formData.append('upload_preset', 'jobApp'); // Replace with your upload preset
      formData.append('cloud_name', 'dwnqftgj0'); // Replace with your cloud name
  
      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dwnqftgj0/image/upload',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        console.log('Response from Cloudinary:', response);
  
        const cloudinaryUrl = response.data.secure_url;
        console.log('Image uploaded successfully:', cloudinaryUrl);
  
        Alert.alert('Success', 'Image uploaded successfully!');
      } catch (error) {
        console.error('Upload failed:', error);
        Alert.alert('Upload failed', 'An error occurred while uploading the image.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      Alert.alert('Error', 'Failed to convert the image.');
    }
  };
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Pick an image" onPress={pickImage} />
      {imageUri && (
        <>
          <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
          <Button
            title={loading ? 'Uploading...' : 'Upload Image'}
            onPress={uploadImageToCloudinary}
            disabled={loading}
          />
        </>
      )}
    </View>
  );
}
