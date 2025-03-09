import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CText from '../../components/CText';
import { getUserData } from '../../services/UserDataService';
import { getJobPost } from '../../services/JobPostService';
import { ActivityIndicator } from 'react-native-paper';
import { appliedJob, applyJobPost } from '../../services/ApplicationService';

const { width } = Dimensions.get('window');

const JobPostList = () => {
  const navigate = useNavigation();
  const [jobApplicationsDataState, setJobApplicationsDataState] = useState([]);
  const [userData, setUserData] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [loadingJobPost, setLoadingJobPost] = useState({});
  // const [resumeData, setResumeData] = useState([]);

  const fetchAppliedJobsStatus = async (userId, jobPostData) => {
    const appliedJobsStatus = {};
    for (const job of jobPostData) {
      const isApplied = await appliedJob(userId, job.job_post_id);
      appliedJobsStatus[job.job_post_id] = isApplied.length ? true : false;
    }
    setAppliedJobs(appliedJobsStatus);
  };

  const applyJobForApplicant = async (jobpostId) => {
    setLoadingJobPost((prevState) => ({
      ...prevState,
      [jobpostId]: true, // Set loading to true before sending the request
    }));

    let data = {
      applicant_id: userData.applicant_id,
      job_post_id: jobpostId,
      application_status: "pending",
      application_ats_score: 7.5,
      is_deleted: "false",
    };

    try {
      let resp = await applyJobPost(data);
      console.log(resp);
      // After successful application, update applied jobs
      setAppliedJobs((prevState) => ({
        ...prevState,
        [jobpostId]: true, // Mark as applied after success
      }));
    } catch (error) {
      console.error('Error applying for job:', error);
      // Handle error by showing a failure state
      setAppliedJobs((prevState) => ({
        ...prevState,
        [jobpostId]: false, // Revert applied state
      }));
    } finally {
      setLoadingJobPost((prevState) => ({
        ...prevState,
        [jobpostId]: false, // Set loading to false after request completes
      }));
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (userData.applicant_id) {
        fetchAppliedJobsStatus(userData.applicant_id, jobApplicationsDataState);
      }
    }, [userData, jobApplicationsDataState])
  );

  useEffect(() => {
    // Fetch job posts data
    const fetchData = async () => {
      try {
        const user = await getUserData();
        setUserData(user);

        // const resumeData = await getResume(data.applicant_id);
        // console.log(resumeData, "resume");
        // setResumeData(resumeData);

        const jobPostData = await getJobPost();
        setJobApplicationsDataState(jobPostData);

        const appliedJobsStatus = {};
        for (const job of jobPostData) {
          const isApplied = await appliedJob(user.applicant_id, job.job_post_id);
          appliedJobsStatus[job.job_post_id] = isApplied.length ? true : false;
        }

        setAppliedJobs(appliedJobsStatus);
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsDataLoaded(true);
      }
    };

    fetchData();
  }, []);

  if (!isDataLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} color={"#000"} size={"large"} />
      </View>
    );
  }

  // Render function for Job Application Card
  const renderJobApplicationItem = ({ item }) => {
    const isApplied = appliedJobs[item.job_post_id]; // Check if the job has been applied
    const isLoading = loadingJobPost[item.job_post_id]; // Check if the job is being applied for
    console.log(isApplied, "isApplied")
    return (
      <TouchableOpacity style={styles.jobCard} onPress={() => navigate.navigate('Home', { screen: 'ApplicationDetail', params: { applicationId: item.job_post_id } })}>
        <View style={styles.jobContent}>
          {/* Left side (Job details) */}
          <View style={styles.jobDetails}>
            <CText fontWeight={600} sx={styles.jobTitle}>{item.job_post_name}</CText>
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
              <TouchableOpacity style={styles.applyNowButton} onPress={() => applyJobForApplicant(item.job_post_id)}>
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
    );
  };

  return (
    <View style={styles.container}>
      {/* Job Applications Section */}
      <View style={styles.sectionHeader}>
        <CText fontWeight={600} sx={styles.sectionTitle}>Job Posts</CText>
      </View>

      <FlatList
        data={jobApplicationsDataState}
        renderItem={renderJobApplicationItem}
        keyExtractor={(item) => item.job_post_id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    paddingBottom: 140
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  jobDetails: {
    flex: 1,
    marginRight: 10,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  jobStatus: {
    fontSize: 14,
    marginBottom: 5,
  },
  jobStatusText: {
    color: 'green',
  },
  jobLocation: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  applyNowButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  applyNowText: {
    color: '#fff',
  },
  jobImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});

export default JobPostList;
