import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CStatisticsCard from '../../components/CIconStatisticsCard';
import CText from '../../components/CText';
import { getUserData } from '../../services/UserDataService';
import { getRecruiter } from '../../services/RecruiterService';
import { ActivityIndicator } from 'react-native-paper';
import { getJobPost } from '../../services/JobPostService';
import { getBlog } from '../../services/BlogService';
import { getCompanyData } from '../../services/ProfileService';
import { appliedJob, applyJobPost } from '../../services/ApplicationService';
import { getResume } from '../../services/ResumeService';

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
  const wordCount = content.split(' ').length;
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
  const [companyList, setCompanyList] = useState(null)
  const [appliedJobs, setAppliedJobs] = useState({});
  const [loadingJobPost, setLoadingJobPost] = useState({});
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    // Define an async function inside the useEffect
    const fetchData = async () => {
      try {
        const data = await getUserData();
        setCompanyData(data);
        console.log(data);

        const resumeData = await getResume(data.applicant_id);
        console.log(resumeData, "resume");
        setResumeData(resumeData);

        const companyData = await getCompanyData()
        setCompanyList(companyData)
        console.log(companyData)

        const jobPostData = await getJobPost(undefined, undefined, 3)
        setJobApplicationsDataState(jobPostData)

        const appliedJobsStatus = {};
        for (const job of jobPostData) {
          const isApplied = await appliedJob(data.applicant_id, job.job_post_id);
          appliedJobsStatus[job.job_post_id] = isApplied?.length ? true : false;
        }

        setAppliedJobs(appliedJobsStatus);

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

  useFocusEffect(
    React.useCallback(() => {
      if (companyData?.applicant_id) {
        fetchAppliedJobsStatus(companyData?.applicant_id, jobApplicationsDataState);
      }
    }, [companyData, jobApplicationsDataState])
  );

  const fetchAppliedJobsStatus = async (userId, jobPostData) => {
    const appliedJobsStatus = {};
    for (const job of jobPostData) {
      const isApplied = await appliedJob(userId, job.job_post_id);
      appliedJobsStatus[job.job_post_id] = isApplied.length ? true : false;
    }
    setAppliedJobs(appliedJobsStatus);
  };

  const applyJobForApplicant = async (jobpostId) => {
    console.log("hello")
    setAppliedJobs((prevState) => ({
      ...prevState,
      [jobpostId]: true, // Mark the job as applied immediately
    }));
    // Mark the job as "loading" before sending the request
    setLoadingJobPost((prevState) => ({ ...prevState, [jobpostId]: true }));

    let data = {
      applicant_id: companyData.applicant_id,
      job_post_id: jobpostId,
      application_status: "pending",
      application_ats_score: 7.5,
      is_deleted: "false"
    };

    try {
      // Apply for the job
      let resp = await applyJobPost(data);
      console.log(resp);
    } catch (error) {
      console.error('Error applying for job:', error);
      // If there's an error, revert the applied status
      setAppliedJobs((prevState) => ({
        ...prevState,
        [jobpostId]: false, // Revert to "not applied"
      }));
    } finally {
      // Set loading state back to false after the API call is done
      setLoadingJobPost((prevState) => ({ ...prevState, [jobpostId]: false }));
    }
  };

  console.log(recruitersDataState)
  if (!isDataLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
        <ActivityIndicator animating={true} color={"#000"} size={"large"} />
      </View>
    )
  }

  // Render function for Job Application Card
  const renderJobApplicationItem = ({ item }) => {
    const isApplied = appliedJobs[item.job_post_id];
    const isLoading = loadingJobPost[item.job_post_id];
    return (
      <TouchableOpacity style={styles.jobCard} onPress={() => navigate.navigate('Home', { screen: 'ApplicationDetail', params: { applicationId: item.job_post_id } })}>
        <View style={styles.jobContent}>
          {/* Left side (Job details) */}
          <View style={styles.jobDetails}>
            <CText fontWeight={600} sx={styles.jobTitle}>{item.job_post_name}</CText>
            {/* <CText sx={styles.companyName}>{item.company_name}</CText> */}
            <CText sx={styles.jobStatus}>Status: <CText sx={styles.jobStatusText}>{item.is_deleted === "False" ? "Open" : "Closed"}</CText></CText>
            <CText sx={styles.jobLocation}><Icon name="map-marker" size={16} color="#5B5B5B" /> {item.job_post_location}</CText>

            {/* Apply Now Button */}
            {isApplied ? (
              <TouchableOpacity style={{ ...styles.applyNowButton, backgroundColor: 'green' }}>
                <CText fontWeight={600} sx={styles.applyNowText}>
                  Applied
                </CText>
              </TouchableOpacity>
            ) : isLoading ? (
              <ActivityIndicator animating={true} color="#fff" size="small" />
            ) : (
              <TouchableOpacity style={!Boolean(resumeData.length) ? {...styles.applyNowButton} : {backgroundColor:"#000"}} disabled={!Boolean(resumeData.length)} onPress={() => applyJobForApplicant(item.job_post_id)}>
                <CText fontWeight={600} sx={styles.applyNowText}>
                  Apply Now
                </CText>
              </TouchableOpacity>
            )}
          </View>

          {/* Right side (Image) */}
          <Image source={{ uri: "https://cdn3.pixelcut.app/7/20/uncrop_hero_bdf08a8ca6.jpg" }} style={styles.jobImage} resizeMode="contain" />
        </View>
      </TouchableOpacity>
    )
  };

  // Render function for Blog Card
  const renderBlogItem = ({ item }) => {
    const truncatedDescription = item.blog_description.length > 50
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

  // Render function for Company Card
  const renderCompanyItem = ({ item }) => {
    const truncateDescription = (desc) => {
      // Truncate description to a maximum of 30 characters
      return desc.length > 30 ? desc.substring(0, 30) + '...' : desc;
    };

    console.log(item)

    return (
      <View style={styles.blogCard}>
        {/* Company Logo */}
        <Image source={{ uri: item.company_logo }} style={[styles.logo, { width: 50, height: 50, borderRadius: 50 }]} resizeMode="contain" />

        {/* Company Name */}
        <CText fontWeight={600} fontSize={18}>{item.company_name}</CText>

        {/* Truncated Description */}
        <CText>{truncateDescription(item.company_description)}</CText>

        <View style={styles.contactInfo}>
          {/* Phone Icon and Phone Number */}
          <View style={styles.contactItem}>
            <Icon name="phone" size={18} color="#4CAF50" style={styles.icon} />
            <CText>{item.company_phone}</CText>
          </View>

          {/* Email Icon and Email */}
          <View style={styles.contactItem}>
            <Icon name="envelope" size={18} color="#2196F3" style={styles.icon} />
            <CText>{item.company_email}</CText>
          </View>
        </View>

        {/* View Details Button */}
        <TouchableOpacity
          onPress={() => navigate.navigate('Home', { screen: "Company Profile" })}
          // onPress={() => console.log("hello")}
          style={styles.viewDetailsButton}
        >
          <CText>View Details</CText>
        </TouchableOpacity>
      </View>
    );
  };

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
        <CText fontWeight={600} sx={styles.sectionTitle}>Companies</CText>
        <TouchableOpacity onPress={() => navigate.navigate('Recruiters', { screen: "MyRecruiter" })}>
          <CText sx={styles.moreButton}>More</CText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={companyList}
        renderItem={renderCompanyItem}
        keyExtractor={(item) => item.company_id}
        horizontal
        snapToInterval={width * 0.75}
        decelerationRate="fast"
        snapToAlignment="center"
        pagingEnabled
      />

      {/* Job Applications Section */}
      <View style={styles.sectionHeader}>
        <CText fontWeight={600} sx={styles.sectionTitle}>Job Posts</CText>
        <TouchableOpacity onPress={() => navigate.navigate('Jobs', { screen: "Job Post List" })}>
          <CText sx={styles.moreButton}>More</CText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={jobApplicationsDataState}
        renderItem={renderJobApplicationItem}
        keyExtractor={(item) => item.job_post_id}
        horizontal
        snapToInterval={width * 0.9}
        decelerationRate="fast"
        snapToAlignment="center"
        pagingEnabled
      />

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
  contactInfo: {
    marginBottom: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 10,
  },
  icon: {
    marginRight: 10,
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
  jobCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    margin: 8,
    width: width * 0.85,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: 'row', // Use row layout for left and right side
    alignItems: 'center', // Center vertically in the row
  },
  jobContent: {
    flexDirection: 'row', // Make job content layout horizontal
    justifyContent: 'space-between', // Space between left and right sides
    width: '100%', // Ensure the content takes full width
  },
  jobDetails: {
    flex: 1, // Left side takes available space
    marginRight: 10, // Add space between the text content and image
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333', // Dark text color for job title
  },
  companyName: {
    fontSize: 16,
    color: '#555', // Lighter color for company name
    marginBottom: 5,
  },
  jobStatus: {
    fontSize: 14,
    marginBottom: 5,
  },
  jobStatusText: {
    color: 'green', // Green color for "Open" status
  },
  jobLocation: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  jobImage: {
    width: 80,
    height: 80,
    borderRadius: 8, // Rounded corners for the image
  },
  viewDetailsButton: {
    marginTop: 10,
    padding: 5,
    color: '#0d0ddb'
  },
  applyNowButton: {
    backgroundColor: '#007bff', // Attractive blue color for the button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25, // Rounded corners for the button
    alignItems: 'center', // Center the text inside the button
    marginTop: 10,
  },
  applyNowText: {
    color: '#fff', // White text for the button
    // fontWeight: '600',
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
