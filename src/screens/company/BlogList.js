import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CText from '../../components/CText';
import { getBlog } from '../../services/BlogService';
import { ActivityIndicator } from 'react-native-paper';
import dayjs from 'dayjs';

// Helper function to estimate reading time
const calculateReadingTime = (content) => {
  const wordsPerMinute = 30; // Average reading speed (words per minute)
  const wordCount = content.split(' ').length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
};

const BlogListScreen = ( {route} ) => {
  let userId = route.params?.userId || 0;
  // console.log(userId)
  const navigation = useNavigation();
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [blogData, setBlogData] = useState([])

  useEffect(() => {
    // Define an async function inside the useEffect
    const fetchData = async () => {
      if (userId) { 
        try {
          const data = await getBlog(null, userId);
          setBlogData(data)
          console.log(data);
          setIsDataLoaded(true);
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsDataLoaded(true);
        }
        return
      }
      try {
        const data = await getBlog();
        setBlogData(data)
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

  function truncateDecs(description) {
    const maxLength = 70;
    const truncatedDescription = description.length > maxLength
      ? description.substring(0, maxLength) + '...'
      : description;

    return truncatedDescription;
  }

  // Navigate to the Blog Detail screen
  const handleBlogPress = (blogId) => {
    navigation.navigate('Blog Detail', { blogId });
  };

  const renderBlogCard = async ({ item }) => {
    const readingTime = calculateReadingTime(item.blog_description);

    return (
      <TouchableOpacity style={styles.card} onPress={() => handleBlogPress(item.blog_id)}>
        <View>
          <Image source={{ uri: item.blog_image }} style={styles.blogImage} />
          <View style={{ flex: 1, flexDirection: "row", marginTop: 7 }}>
            <Icon name="clock-o" size={16} color="#777" style={styles.readingTimeIcon} />
            <CText sx={styles.readingTimeText}>{readingTime} min read</CText>
          </View>
        </View>
        <View style={styles.cardContent}>
          <CText fontWeight={600} sx={styles.blogTitle}>{item.blog_title}</CText>
          <CText sx={styles.blogExcerpt}>{truncateDecs(item.blog_description)}</CText>
          <CText sx={styles.blogAuthor}>By {item.created_by_name} - {dayjs(item.created_at).format("DD/MM/YYYY")}</CText>
          <View style={styles.readingTimeContainer}>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={blogData}
        renderItem={renderBlogCard}
        keyExtractor={(item) => item.blog_id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginBottom: 70
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  blogImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  blogTitle: {
    fontSize: 18,
    color: '#333',
  },
  blogExcerpt: {
    fontSize: 12,
    color: '#777',
    marginVertical: 8,
  },
  blogAuthor: {
    fontSize: 12,
    color: '#aaa',
  },
  readingTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  readingTimeIcon: {
    marginRight: 5,
  },
  readingTimeText: {
    fontSize: 12,
    color: '#777',
  },
});

export default BlogListScreen;
