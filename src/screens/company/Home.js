import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import CStatisticsCard from '../../components/CIconStatisticsCard';
import CText from '../../components/CText';
import { getUserData } from '../../services/UserDataService';
import { getRecruiter } from '../../services/RecruiterService';
import { ActivityIndicator } from 'react-native-paper';
import { getJobPost } from '../../services/JobPostService';
import { getBlog } from '../../services/BlogService';

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

const calculateReadingTime = (content) => {
  const wordsPerMinute = 30; // Average reading speed (words per minute)
  const wordCount = content.split(' ')?.length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
};

const HomePage = () => {
  const navigate = useNavigation();
  const [recruitersDataState, setRecruitersDataState] = useState(recruitersData);
  const [jobApplicationsDataState, setJobApplicationsDataState] = useState([]);
  const [blogsDataState, setBlogsDataState] = useState(blogsData);
  const [companyData, setCompanyData] = useState(null)
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  useEffect(() => {
    // Define an async function inside the useEffect
    const fetchData = async () => {
      try {
        const data = await getUserData();
        setCompanyData(data);
        console.log(data);

        const recruiterData = await getRecruiter(data?.company_email, 3)
        console.log(recruiterData)
        setRecruitersDataState(recruiterData)

        const jobPostData = await getJobPost(data?.company_email, undefined, 3)
        console.log(jobPostData)
        setJobApplicationsDataState(jobPostData)

        const blogData = await getBlog(null, null, 3)
        setBlogsDataState(blogData)

        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsDataLoaded(true);
      }
    };

    // Call the async function
    fetchData();
  }, [])

  console.log(recruitersDataState)
  if (!isDataLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
        <ActivityIndicator animating={true} color={"#000"} size={"large"} />
      </View>
    )
  }

  // Render function for Job Application Card
  const renderJobApplicationItem = ({ item }) => (
    <View style={styles.jobCard}>
      <Icon name="briefcase" size={24} color="#5B5B5B" />
      <CText fontWeight={600} sx={styles.jobTitle}>{item.job_post_name}</CText>
      <CText>Status: <CText sx={styles.jobStatus}>{item.is_deleted === "False" ? "Open" : "Closed"}</CText></CText>
      <CText><Icon name="map-marker" size={16} color="#5B5B5B" /> {item.job_post_location}</CText>
      <CText>Applicants: {item.applicants}</CText>
      <TouchableOpacity onPress={() => navigate.navigate('Applications', { screen: 'ApplicationDetail', params: { applicationId: item.job_post_id } })}>
        <CText sx={styles.viewDetailsButton}>View Details</CText>
      </TouchableOpacity>
    </View>
  );

  // Render function for Blog Card
  const renderBlogItem = ({ item }) => {
    const truncatedDescription = item.blog_description?.length > 50
      ? item.blog_description.slice(0, 50) + "..."
      : item.blog_description;

    return (
      <View style={styles.blogCard}>
        <View style={styles.blogImage}>
          <Image source={{ uri: item.blog_image }} style={{ borderRadius: 8 }} height={100} />
        </View>
        <CText fontWeight={600} sx={styles.blogTitle}>{item.blog_title}</CText>
        <CText sx={styles.blogDescription}>{truncatedDescription}</CText>
        <View style={styles.readTimeContainer}>
          <Icon name="clock-o" size={18} color="#000" />
          <CText sx={styles.readTime}>Time to read: {calculateReadingTime(item.blog_description)}</CText>
        </View>
        <View style={styles.readsContainer}>
          <Icon name="eye" size={18} color="#000" />
          <CText sx={styles.reads}>Reads: {item.reads}</CText>
        </View>
        <TouchableOpacity onPress={() => navigate.navigate('Blog Detail', { blogId: item.blog_id })}>
          <CText sx={styles.readMoreButton}>Read More</CText>
        </TouchableOpacity>
      </View>
    )
  };

  // Render function for Recruiter Card
  const renderRecruiterItem = ({ item }) => (
    <View style={styles.recruiterCard}>
      {console.log(item)}
      <Icon name="user" size={24} color="#5B5B5B" />
      <CText fontWeight={600} fontSize={18}>{item.recruiter_name}</CText>
      <CText>Applications Created: {item.jobApplications}</CText>
      <CText>Hired: {item.hired}</CText>
      <TouchableOpacity onPress={() => navigate.navigate('Recruiters', { screen: 'RecruiterDetail', params: { recruiterId: item.recruiter_id } })}>
        <CText sx={styles.viewDetailsButton}>View Details</CText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subscriptionSection}>
        <CText sx={styles.subscriptionTitle}>Current Subscription: Premium</CText>
        <Icon name="star" size={30} color="#FFD700" />
      </View>

      <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
        <CStatisticsCard label={"Recruiter"} value={"1000"} iconName={"home"} />
        <CStatisticsCard label={"Recruiter"} value={"1000"} iconName={"home"} />
        <CStatisticsCard label={"Recruiter"} value={"1000"} iconName={"home"} />
        <CStatisticsCard label={"Recruiter"} value={"1000"} iconName={"home"} />
      </View>

      {/* Recruiters Section */}
      <View style={styles.sectionHeader}>
        <CText fontWeight={600} sx={styles.sectionTitle}>Recruiters</CText>
        <TouchableOpacity onPress={() => navigate.navigate('Recruiters', { screen: "MyRecruiter" })}>
          <CText sx={styles.moreButton}>More</CText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={recruitersDataState}
        renderItem={renderRecruiterItem}
        keyExtractor={(item) => item.recruiter_id}
        horizontal
        snapToInterval={width * 0.75}
        decelerationRate="fast"
        snapToAlignment="center"
        pagingEnabled
      />

      {/* Job Applications Section */}
      <View style={styles.sectionHeader}>
        <CText fontWeight={600} sx={styles.sectionTitle}>Job Posts</CText>
        <TouchableOpacity onPress={() => navigate.navigate('Applications', { screen: "MyJobApplication" })}>
          <CText sx={styles.moreButton}>More</CText>
        </TouchableOpacity>
      </View>
      {
        jobApplicationsDataState.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <CText style={styles.noResultsText}>No Job Post Present</CText>
          </View>) : (<FlatList
        data={jobApplicationsDataState}
        renderItem={renderJobApplicationItem}
        keyExtractor={(item) => item.job_post_id}
        horizontal
        snapToInterval={width * 0.75}
        decelerationRate="fast"
        snapToAlignment="center"
        pagingEnabled
      />)
      }
      

      {/* Blogs Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Latest Blogs</Text>
        <TouchableOpacity onPress={() => navigate.navigate('Blog List')}>
          <Text style={styles.moreButton}>More</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={blogsDataState}
        renderItem={renderBlogItem}
        keyExtractor={(item) => item.blog_id}
        horizontal
        snapToInterval={width * 0.75}
        decelerationRate="fast"
        snapToAlignment="center"
        pagingEnabled
      />
      <View style={{ marginBottom: 120 }}></View>
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
    marginBottom: 10,
  },
  jobStatus: {
    color: 'green',
  },
  viewDetailsButton: {
    marginTop: 10,
    color: '#0d0ddb'
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
});

export default HomePage;
