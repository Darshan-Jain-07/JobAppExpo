import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import CText from '../../components/CText';

const BlogPage = ({ route }) => {
  const { blogId } = route.params;
  const blogDetails = {
    title: "How to Build a Blog App in React Native",
    date: "November 14, 2024",
    author: "Jane Doe",
    content: `
      React Native is a popular framework for building mobile applications using JavaScript and React. 
      It allows developers to write applications for both iOS and Android platforms using a single codebase. 
      In this tutorial, we will learn how to create a simple blog app in React Native.
      
      ## Prerequisites:
      - You should have basic knowledge of JavaScript and React.
      - You need to have React Native set up on your machine (you can follow the official React Native documentation to get started).

      ## Setting up the Project:
      To start, create a new React Native project using the following command:
      
      \`\`\`
      npx react-native init BlogApp
      \`\`\`

      ## App Structure:
      Your project structure should look like this:
      - App.js: Main file where you'll write the logic.
      - assets/: Folder to store images.
      - components/: Folder for reusable components (like BlogCard).
      - styles/: Folder to store styles for the app.
      
      ## Conclusion:
      With the above steps, you can create a simple blog app using React Native. Once you are comfortable with this, you can explore adding more features such as user authentication, API integration, and much more.

      Happy coding!
    `,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyv_ORNd0zcFnrBQlA3SSRU3S3dDs0KSt-NA&s",
  };

  console.log(blogId)

  return (
    <ScrollView style={styles.container}>
      {/* Blog Image */}
      <Image source={{ uri: blogDetails.imageUrl }} style={styles.blogImage} />

      {/* Blog Title */}
      <CText fontWeight={700} sx={styles.title}>{blogDetails.title}</CText>

      {/* Blog Meta Information */}
      <View style={styles.metaContainer}>
        <CText sx={styles.date}>{blogDetails.date}</CText>
        <CText sx={styles.author}>By {blogDetails.author}</CText>
      </View>

      {/* Blog Content */}
      <CText sx={styles.content}>{blogDetails.content}</CText>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  blogImage: {
    width: '100%',
    height: 250,
    marginBottom: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    color: '#333',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  author: {
    fontSize: 14,
    color: '#888',
  },
  content: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 100
  },
});

export default BlogPage;
