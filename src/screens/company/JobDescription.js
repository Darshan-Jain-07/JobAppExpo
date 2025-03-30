import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CChip from '../../components/CChip';
import CText from '../../components/CText';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getJobPost, updateJobPost } from '../../services/JobPostService';
import { getCompanyData } from '../../services/ProfileService';
import { getRecruiter } from '../../services/RecruiterService';
import { ActivityIndicator } from 'react-native-paper';
import { getApplication, updateApplication } from '../../services/ApplicationService';
import { getUserInfo } from '../../services/AuthService';
import { getUserData } from '../../services/UserDataService';

// Job details object
// const jobDetails = {
//   jobTitle: 'Software Engineer',
//   companyName: 'TechCorp Ltd.',
//   location: 'San Francisco, CA',
//   companyLogo: 'https://marketplace.canva.com/EAE0rNNM2Fg/1/0/1600w/canva-letter-c-trade-marketing-logo-design-template-r9VFYrbB35Y.jpg',
//   salaryRange: '70,000 - 90,000',
//   jobType: 'Full-time',
//   experienceLevel: 'Experienced',
//   applicantsCount: 120,
//   description: 'We are looking for a skilled Software Engineer to join our dynamic development team. The ideal candidate will have a passion for technology, a strong understanding of software engineering principles, and the ability to work collaboratively in an Agile environment.',
//   responsibilities: [
//     { id: '1', text: 'Develop and maintain high-quality software applications.' },
//     { id: '2', text: 'Collaborate with cross-functional teams to define and design new features.' },
//     { id: '3', text: 'Ensure the performance, quality, and responsiveness of applications.' },
//     { id: '4', text: 'Participate in code reviews and ensure adherence to best practices.' },
//   ],
//   requirements: [
//     { id: '1', text: 'Bachelor\'s degree in Computer Science or related field.' },
//     { id: '2', text: '3+ years of experience in software development.' },
//     { id: '3', text: 'Proficiency in JavaScript, React Native, and Node.js.' },
//     { id: '4', text: 'Strong problem-solving skills and the ability to work independently.' },
//   ],
//   reviews: [
//     { id: '1', name: 'John Doe', text: 'Great place to work! The team is collaborative.', rating: 4.5 },
//     { id: '2', name: 'Jane Smith', text: 'Challenging projects but great management and career growth opportunities.', rating: 5 },
//     { id: '3', name: 'Michael Brown', text: 'A fantastic work-life balance!', rating: 4.0 },
//   ],
//   applicants: [
//     { id: '1', name: 'Alice Johnson', position: 'Software Engineer' },
//     { id: '2', name: 'Bob Lee', position: 'Frontend Developer' },
//     { id: '3', name: 'Charlie Green', position: 'Backend Developer' },
//   ],
// };

const ApplicantItem = ({ item }) => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [currentUser, setCurrentUser] = useState({});

  const handleApplicantCardPress = (id) => {
    console.log(item?.application_status === "rejected" || item?.application_status === "accepted" || item?.application_status === "in_review", "item?.applicant_status")
    if (item?.application_status === "rejected" || item?.application_status === "accepted" || item?.application_status === "in_review") {
    } else {
      updateApplication({ id: item?.application_id, application_status: "in_review" })
    }
    if (currentUser?.recruiter_id) {
      navigation.navigate('View Applicant Detail', { applicationId: id });
    } else {
      navigation.navigate('View Applicant Detail', { applicationId: id });
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserInfo(item.applicant_id);
      const curdata = await getUserData();
      setUserData(data?.[0]);
      setCurrentUser(curdata)
    };
    fetchUserData();
  }, [item.applicant_id]);
  if (!userData) {
    return null;
  }

  return (
    <TouchableOpacity onPress={() => handleApplicantCardPress(userData?.applicant_id)} style={styles.applicantCard}>
      <View style={styles.applicantInfo}>
        <Image source={{ uri: userData?.applicant_profile_url }} style={styles.profilePhoto} />
        <View>
          <CText sx={styles.applicantName} fontSize={18} fontWeight={600}>{userData?.applicant_name}</CText>
          {/* <CText sx={styles.applicantPosition}>{item.position}</CText> */}
        </View>
      </View>
      <CText color={"#0017ff"} sx={{ paddingTop: 15 }}>View</CText>
    </TouchableOpacity>
  );
};

const JobDescription = ({ route }) => {
  const { applicationId } = route.params;
  const navigation = useNavigation();
  const [jobDetails, setJobDetails] = useState({});
  const [companyData, setCompanyData] = useState(null);
  const [recruiterData, setRecruiterData] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [reviews, setReviews] = useState(jobDetails?.reviews);
  const [applicants, setApplicants] = useState([]);
  const [noOfApplicants, setNoOfApplicants] = useState(0);
  const [userData, setUserData] = useState({});
  const isFocus = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      let companyData = await getUserData();
      setUserData(companyData)

      const application_details = await getJobPost(null, null, null, applicationId);
      setJobDetails(application_details?.[0])

      const applicants = await getApplication(null, applicationId, null);
      setNoOfApplicants(applicants.length || 0);
      console.log("Application", applicants)
      setApplicants(applicants);

      const company_data = await getCompanyData("company_email", application_details?.[0]?.company_id);
      setCompanyData(company_data?.[0])

      const recruiter_data = await getRecruiter(null, null, application_details?.[0]?.recruiter_id);
      setRecruiterData(recruiter_data?.[0])

      setIsDataLoaded(true)
    }

    fetchData();
  }, [applicationId, isFocus])

  if (!isDataLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
        <ActivityIndicator animating={true} color={"#000"} size={"large"} />
      </View>
    )
  }

  const handleReviewSubmit = async (values, { resetForm }) => {
    const newReview = { id: Date.now().toString(), name: userData?.company_name, text: values.reviewText };
    console.log('Submitting review:', newReview);
    setJobDetails({ ...jobDetails, job_post_review: [newReview, ...jobDetails?.job_post_review || []] });
    await updateJobPost({ id: jobDetails?.job_post_id, job_post_review: [newReview, ...jobDetails?.job_post_review || []] })
  };

  const handleApplicantCardPress = (applicantId) => {
    console.log("Navigating to applicant:", applicantId);
    navigation.navigate('Recruiters', { screen: 'ApplicantDetail' });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Job Info */}
      <View style={styles.card}>
        {console.log(jobDetails, "sdfsdfsdf")}
        <Image style={styles.companyLogo} source={{ uri: jobDetails?.company_id ? companyData?.company_logo : recruiterData?.recruiter_image }} />
        <CText sx={styles.jobTitle} fontSize={24} fontWeight={600}>{jobDetails?.job_post_name}</CText>
        {jobDetails?.company_id && <CText sx={styles.companyName}>{companyData?.company_name}</CText>}
        <View style={styles.locationContainer}>
          <Icon name="map-marker" size={18} color="#888" />
          <Text style={styles.location}>{jobDetails?.job_post_location}</Text>
        </View>
        <View style={styles.locationContainer}>
          <Icon name="user" size={18} color="#888" />
          <Text style={styles.location}>{recruiterData?.recruiter_name}</Text>
        </View>
      </View>

      {/* Chips Section (Salary, Job Type, Experience, Applicants) */}
      <View style={styles.chipContainer}>
        <FlatList
          data={[
            { icon: 'rupee', text: jobDetails?.job_post_salary },
            { icon: 'clock-o', text: jobDetails?.job_post_employment_type },
            { icon: 'graduation-cap', text: jobDetails?.job_post_experience_level },
            { icon: 'users', text: `${noOfApplicants} Applicants` },
          ]}
          horizontal
          renderItem={({ item }) => <CChip icon={item.icon} text={item.text} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      {/* Job Description */}
      <View style={styles.card}>
        <CText sx={styles.sectionTitle} fontSize={20} fontWeight={600}>Job Description</CText>
        <CText sx={styles.description}>{jobDetails?.job_post_description}</CText>
      </View>

      {/* Responsibilities */}
      <View style={styles.card}>
        <CText sx={styles.sectionTitle} fontSize={20} fontWeight={600}>Responsibilities</CText>
        <FlatList
          data={jobDetails?.job_post_responsibility}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Icon name="circle" size={10} color="#555" />
              <CText style={styles.listText}>{item}</CText>
            </View>
          )}
        />
      </View>

      {/* Requirements */}
      <View style={styles.card}>
        <CText sx={styles.sectionTitle} fontSize={20} fontWeight={600}>Requirements</CText>
        <FlatList
          data={jobDetails?.job_post_requirement}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Icon name="circle" size={10} color="#555" />
              <CText sx={styles.listText}>{item}</CText>
            </View>
          )}
        />
      </View>
    </View>
  );

  const handleViewAll = () => {
    if (userData?.recruiter_id) {
      navigation.navigate('Bottom Navigation Recruiter', { screen: "Recruiters", params: { screen: "ApplicantsList", params: { applicationId } } })
    }
    else {
      navigation.navigate('Bottom Navigation App', { screen: "Applications", params: { screen: "ApplicantsList", params: { applicationId } } })
    }
  }

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      {/* Reviews Section */}
      <View style={styles.card}>
        <CText sx={styles.sectionTitle} fontSize={20} fontWeight={600}>Reviews</CText>
        <FlatList
          data={jobDetails?.job_post_review}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          snapToAlignment="center"
          decelerationRate="fast"
          snapToInterval={285}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Icon name="user-circle" size={30} color="#333" />
                <CText sx={styles.reviewName} fontSize={16} fontWeight={600}>{item.name}</CText>
              </View>
              <CText sx={styles.reviewText}>{item.text}</CText>
              {/* <TouchableOpacity onPress={() => handleDeleteReview(item.id)} style={styles.deleteButton}>
                <CText style={styles.deleteButtonText} fontWeight={600} color={"#fff"}>Delete</CText>
              </TouchableOpacity> */}
            </View>
          )}
        />
      </View>

      {/* Review Form */}
      <View style={styles.card}>
        <CText sx={styles.sectionTitle} fontSize={20} fontWeight={600}>Write a Review</CText>
        <Formik
          initialValues={{ reviewText: '' }}
          validationSchema={Yup.object({
            reviewText: Yup.string().required('Review text is required').min(10, 'Review must be at least 10 characters'),
          })}
          onSubmit={handleReviewSubmit}
        >
          {({ values, handleChange, handleSubmit, errors, touched }) => (
            <View>
              <TextInput
                style={styles.reviewInput}
                multiline
                numberOfLines={4}
                placeholder="Write your review here"
                value={values.reviewText}
                onChangeText={handleChange('reviewText')}
              />
              {errors.reviewText && touched.reviewText && <Text style={styles.errorText}>{errors.reviewText}</Text>}
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <CText style={styles.submitButtonText} color={"#fff"} fontWeight={600}>Submit Review</CText>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>

      {/* Applicants Section */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '97%' }}>
          <CText sx={styles.sectionTitle} fontSize={20} fontWeight={600}>Applicants</CText>
          <TouchableOpacity onPress={handleViewAll} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CText fontSize={15} fontWeight={600} color={"#0084D1"}>View All ({noOfApplicants})</CText>
          </TouchableOpacity>
        </View>
        <FlatList
          data={applicants.slice(0, 3)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (<ApplicantItem item={item} />)
          }}
        />
      </View>

      {/* Apply Button */}
      <View style={{ ...styles.container, paddingBottom: 100, paddingHorizontal: 20 }}>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.applyButtonText}>Delete Application</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={[1]} // Only need one item, because this is just a wrapper to render header and footer
      renderItem={() => null} // No actual items rendered
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      keyExtractor={() => '1'} // Key for the wrapper item
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  applicantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  scrollContainer: {
  },
  card: {
    margin: 16,
    backgroundColor: '#fff',
    padding: 20,
    // marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // For Android shadow
  },
  companyLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 16,
  },
  jobTitle: {
    color: '#333',
    textAlign: 'center',
  },
  companyName: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'center',
  },
  location: {
    fontSize: 16,
    color: '#555',
    marginLeft: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    paddingHorizontal: 16
  },
  sectionTitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  list: {
    marginTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 5
  },
  listText: {
    fontSize: 16,
    color: '#555',
    // marginLeft: 8,
  },
  reviewCard: {
    backgroundColor: '#eee',
    marginRight: 16,
    width: 272,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewName: {
    fontSize: 16,
    // fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  reviewText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#FFD700',
  },
  reviewInput: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  moreReviewsIndicator: {
    marginTop: 10,
    alignItems: 'center',
  },
  moreReviewsText: {
    fontSize: 14,
    color: '#888',
  },
  applicantCard: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  applicantName: {
    fontSize: 16,
    color: '#333',
  },
  applicantPosition: {
    fontSize: 14,
    color: '#555',
  },
  deleteButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default JobDescription;
