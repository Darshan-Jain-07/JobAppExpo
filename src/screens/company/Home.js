import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import CStatisticsCard from '../../components/CIconStatisticsCard';

const { width } = Dimensions.get('window'); // Get screen width for responsive design

// Sample data for recruiters and applications
const recruitersData = [
  { id: '1', name: 'Alex', jobApplications: 120, hired: 80 },
  { id: '2', name: 'Sarah', jobApplications: 200, hired: 140 },
  { id: '3', name: 'Chris', jobApplications: 160, hired: 100 },
];

// Sample data for job applications
const jobApplicationsData = [
  { id: '1', jobTitle: 'Software Developer', status: 'Open', location: 'New York', applicants: 30 },
  { id: '2', jobTitle: 'Data Scientist', status: 'Closed', location: 'San Francisco', applicants: 25 },
  { id: '3', jobTitle: 'UI/UX Designer', status: 'Open', location: 'Los Angeles', applicants: 10 },
];

// Sample data for blogs
const blogsData = [
  { id: '1', title: 'React Native for Beginners', description: 'Learn the basics of React Native...', readTime: '5 mins', reads: 1200 },
  { id: '2', title: 'Building a Backend with Node.js', description: 'Step-by-step guide to build backend...', readTime: '8 mins', reads: 800 },
  { id: '3', title: 'Understanding Redux', description: 'A deep dive into Redux for state management...', readTime: '7 mins', reads: 1500 },
];

const HomePage = () => {
  const navigate = useNavigation();
  const [recruitersDataState, setRecruitersDataState] = useState(recruitersData);
  const [jobApplicationsDataState, setJobApplicationsDataState] = useState(jobApplicationsData);
  const [blogsDataState, setBlogsDataState] = useState(blogsData);

  // Render function for Job Application Card
  const renderJobApplicationItem = ({ item }) => (
    <View style={styles.jobCard}>
      <Icon name="briefcase" size={24} color="#5B5B5B" />
      <Text style={styles.jobTitle}>{item.jobTitle}</Text>
      <Text>Status: <Text style={styles.jobStatus}>{item.status}</Text></Text>
      <Text><Icon name="map-marker" size={16} color="#5B5B5B" /> {item.location}</Text>
      <Text>Applicants: {item.applicants}</Text>
      <TouchableOpacity onPress={() => console.log('View Details')}>
        <Text style={styles.viewDetailsButton}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  // Render function for Blog Card
  const renderBlogItem = ({ item }) => (
    <View style={styles.blogCard}>
      <View style={styles.blogImage}></View>
      <Text style={styles.blogTitle}>{item.title}</Text>
      <Text style={styles.blogDescription}>{item.description}</Text>
      <View style={styles.readTimeContainer}>
        <Icon name="clock-o" size={18} color="#007bff" />
        <Text style={styles.readTime}>Time to read: {item.readTime}</Text>
      </View>
      <View style={styles.readsContainer}>
        <Icon name="eye" size={18} color="#007bff" />
        <Text style={styles.reads}>Reads: {item.reads}</Text>
      </View>
      <TouchableOpacity onPress={() => navigate.navigate('BlogDetail')}>
        <Text style={styles.readMoreButton}>Read More</Text>
      </TouchableOpacity>
    </View>
  );

  // Render function for Recruiter Card
  const renderRecruiterItem = ({ item }) => (
    <View style={styles.recruiterCard}>
      <Icon name="user" size={24} color="#5B5B5B" />
      <Text style={styles.recruiterName}>{item.name}</Text>
      <Text>Applications Created: {item.jobApplications}</Text>
      <Text>Hired: {item.hired}</Text>
      <TouchableOpacity onPress={() => console.log('View Recruiter')}>
        <Text style={styles.viewDetailsButton}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subscriptionSection}>
        <Text style={styles.subscriptionTitle}>Current Subscription: Premium</Text>
        <Icon name="star" size={30} color="#FFD700" />
      </View>

      <CStatisticsCard label={"Recruiter"} value={"1000"} iconName={"home"} />
      <CStatisticsCard label={"Recruiter"} value={"1000"} iconName={"home"} />
      <CStatisticsCard label={"Recruiter"} value={"1000"} iconName={"home"} />
      <CStatisticsCard label={"Recruiter"} value={"1000"} iconName={"home"} />

      {/* Recruiters Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recruiters</Text>
        <TouchableOpacity onPress={() => navigate.navigate('AllRecruiters')}>
          <Text style={styles.moreButton}>More</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={recruitersDataState}
        renderItem={renderRecruiterItem}
        keyExtractor={(item) => item.id}
        horizontal
        snapToInterval={width * 0.7}
        decelerationRate="fast"
        snapToAlignment="center"
        pagingEnabled
      />

      {/* Job Applications Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Job Applications</Text>
        <TouchableOpacity onPress={() => navigate.navigate('AllJobApplications')}>
          <Text style={styles.moreButton}>More</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={jobApplicationsDataState}
        renderItem={renderJobApplicationItem}
        keyExtractor={(item) => item.id}
        horizontal
        snapToInterval={width * 0.7}
        decelerationRate="fast"
        snapToAlignment="center"
        pagingEnabled
      />

      {/* Blogs Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Latest Blogs</Text>
        <TouchableOpacity onPress={() => navigate.navigate('AllBlogs')}>
          <Text style={styles.moreButton}>More</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={blogsDataState}
        renderItem={renderBlogItem}
        keyExtractor={(item) => item.id}
        horizontal
        snapToInterval={width * 0.7}
        decelerationRate="fast"
        snapToAlignment="center"
        pagingEnabled
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  subscriptionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  moreButton: {
    color: '#007bff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    margin: 8,
    width: width * 0.7,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  jobStatus: {
    color: 'green',
  },
  blogCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    margin: 8,
    width: width * 0.7,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  blogImage: {
    height: 100,
    backgroundColor: '#ddd',
    marginBottom: 10,
    borderRadius: 8,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  blogDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 12,
    color: '#777',
    marginLeft: 6,
  },
  readsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reads: {
    fontSize: 12,
    color: '#777',
    marginLeft: 6,
  },
  readMoreButton: {
    color: '#007bff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  recruiterCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    margin: 8,
    width: width * 0.7,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  recruiterName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomePage;
