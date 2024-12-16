import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import CText from '../../components/CText';
import { ActivityIndicator } from 'react-native-paper';
import dayjs from 'dayjs';
import { getBlog } from '../../services/BlogService';

const BlogPage = ({ route }) => {
  const { blogId } = route.params;
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [blogDetail, setBlogDetail] = useState([])

  useEffect(() => {
    // Define an async function inside the useEffect
    const fetchData = async () => {
      try {
        const data = await getBlog(blogId);
        setBlogDetail(data?.[0])
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

  console.log(blogId)

  return (
    <ScrollView style={styles.container}>
      {/* Blog Image */}
      <Image source={{ uri: blogDetail.blog_image }} style={styles.blogImage} />

      {/* Blog Title */}
      <CText fontWeight={700} sx={styles.title}>{blogDetail.blog_title}</CText>

      {/* Blog Meta Information */}
      <View style={styles.metaContainer}>
        <CText sx={styles.date}>{dayjs(blogDetail.created_at).format('DD/MM/YYYY hh:mm a')}</CText>
        <CText sx={styles.author}>By {blogDetail.created_by_name}</CText>
      </View>

      {/* Blog Content */}
      <CText sx={styles.content}>{blogDetail.blog_description}</CText>
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
    marginBottom: 120
  },
});

export default BlogPage;
