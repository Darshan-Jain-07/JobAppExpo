import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CText from '../../components/CText';

// Helper function to estimate reading time
const calculateReadingTime = (content) => {
  const wordsPerMinute = 200; // Average reading speed (words per minute)
  const wordCount = content.split(' ').length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
};

const BlogListScreen = () => {
  const navigation = useNavigation();

  // Sample blog data
  const blogs = [
    {
      id: '1',
      title: 'The Future of AI',
      excerpt: 'Artificial Intelligence is changing the world in incredible ways...',
      content: 'Artificial Intelligence is changing the world in incredible ways. From autonomous vehicles to AI-driven medical research, AI is making its mark across various industries...',
      imageUrl: 'https://via.placeholder.com/150',
      author: 'John Doe',
      date: '2024-11-01',
    },
    {
      id: '2',
      title: 'Tech Innovations in 2024',
      excerpt: 'The tech industry continues to evolve rapidly. Here are the top trends...',
      content: 'The tech industry continues to evolve rapidly. In 2024, we expect a continued surge in innovations such as 5G, machine learning, and the Internet of Things (IoT)...',
      imageUrl: 'https://via.placeholder.com/150',
      author: 'Jane Smith',
      date: '2024-10-25',
    },
    // More blogs...
  ];

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

  const renderBlogCard = ({ item }) => {
    const readingTime = calculateReadingTime(item.content);

    return (
      <TouchableOpacity style={styles.card} onPress={() => handleBlogPress(item.id)}>
        <View>
          <Image source={{ uri: item.imageUrl }} style={styles.blogImage} />
          <View style={{ flex: 1, flexDirection: "row", marginTop: 7 }}>
            <Icon name="clock-o" size={16} color="#777" style={styles.readingTimeIcon} />
            <CText sx={styles.readingTimeText}>{readingTime} min read</CText>
          </View>
        </View>
        <View style={styles.cardContent}>
          <CText fontWeight={600} sx={styles.blogTitle}>{item.title}</CText>
          <CText sx={styles.blogExcerpt}>{truncateDecs(item.content)}</CText>
          <CText sx={styles.blogAuthor}>By {item.author} - {item.date}</CText>
          <View style={styles.readingTimeContainer}>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={blogs}
        renderItem={renderBlogCard}
        keyExtractor={(item) => item.id}
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
