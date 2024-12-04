import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CChip from '../../components/CChip';
import CText from '../../components/CText';
import { useNavigation } from '@react-navigation/native';

// Job details object
const jobDetails = {
  jobTitle: 'Software Engineer',
  companyName: 'TechCorp Ltd.',
  location: 'San Francisco, CA',
  companyLogo: 'https://marketplace.canva.com/EAE0rNNM2Fg/1/0/1600w/canva-letter-c-trade-marketing-logo-design-template-r9VFYrbB35Y.jpg',
  salaryRange: '70,000 - 90,000',
  jobType: 'Full-time',
  experienceLevel: 'Experienced',
  applicantsCount: 120,
  description: 'We are looking for a skilled Software Engineer to join our dynamic development team. The ideal candidate will have a passion for technology, a strong understanding of software engineering principles, and the ability to work collaboratively in an Agile environment.',
  responsibilities: [
    { id: '1', text: 'Develop and maintain high-quality software applications.' },
    { id: '2', text: 'Collaborate with cross-functional teams to define and design new features.' },
    { id: '3', text: 'Ensure the performance, quality, and responsiveness of applications.' },
    { id: '4', text: 'Participate in code reviews and ensure adherence to best practices.' },
  ],
  requirements: [
    { id: '1', text: 'Bachelor\'s degree in Computer Science or related field.' },
    { id: '2', text: '3+ years of experience in software development.' },
    { id: '3', text: 'Proficiency in JavaScript, React Native, and Node.js.' },
    { id: '4', text: 'Strong problem-solving skills and the ability to work independently.' },
  ],
  reviews: [
    { id: '1', name: 'John Doe', text: 'Great place to work! The team is collaborative.', rating: 4.5 },
    { id: '2', name: 'Jane Smith', text: 'Challenging projects but great management and career growth opportunities.', rating: 5 },
    { id: '3', name: 'Michael Brown', text: 'A fantastic work-life balance!', rating: 4.0 },
  ],
  applicants: [
    { id: '1', name: 'Alice Johnson', position: 'Software Engineer' },
    { id: '2', name: 'Bob Lee', position: 'Frontend Developer' },
    { id: '3', name: 'Charlie Green', position: 'Backend Developer' },
  ],
};

const JobDescription = () => {
  const navigation = useNavigation();
  const [reviews, setReviews] = useState(jobDetails.reviews);
  const [applicants, setApplicants] = useState(jobDetails.applicants);

  const handleReviewSubmit = (values, { resetForm }) => {
    const newReview = { id: Date.now().toString(), name: 'New User', text: values.reviewText, rating: 4 };
    setReviews([newReview, ...reviews]);
    resetForm();
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
  };

  const handleApplicantCardPress = (applicantId) => {
    console.log("Navigating to applicant:", applicantId);
    navigation.navigate('Recruiters', { screen: 'ApplicantDetail' });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Job Info */}
      <View style={styles.card}>
        <Image style={styles.companyLogo} source={{ uri: jobDetails.companyLogo }} />
        <CText sx={styles.jobTitle} fontSize={24} fontWeight={600}>{jobDetails.jobTitle}</CText>
        <CText sx={styles.companyName}>{jobDetails.companyName}</CText>
        <View style={styles.locationContainer}>
          <Icon name="map-marker" size={18} color="#888" />
          <Text style={styles.location}>{jobDetails.location}</Text>
        </View>
      </View>

      {/* Chips Section (Salary, Job Type, Experience, Applicants) */}
      <View style={styles.chipContainer}>
        <FlatList
          data={[
            { icon: 'usd', text: jobDetails.salaryRange },
            { icon: 'clock-o', text: jobDetails.jobType },
            { icon: 'graduation-cap', text: jobDetails.experienceLevel },
            { icon: 'users', text: `${jobDetails.applicantsCount} Applicants` },
          ]}
          horizontal
          renderItem={({ item }) => <CChip icon={item.icon} text={item.text} />}
          keyExtractor={(item) => item.text}
        />
      </View>

      {/* Job Description */}
      <View style={styles.card}>
        <CText sx={styles.sectionTitle} fontSize={20} fontWeight={600}>Job Description</CText>
        <CText sx={styles.description}>{jobDetails.description}</CText>
      </View>

      {/* Responsibilities */}
      <View style={styles.card}>
        <CText sx={styles.sectionTitle} fontSize={20} fontWeight={600}>Responsibilities</CText>
        <FlatList
          data={jobDetails.responsibilities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Icon name="circle" size={10} color="#555" />
              <CText style={styles.listText}>{item.text}</CText>
            </View>
          )}
        />
      </View>

      {/* Requirements */}
      <View style={styles.card}>
        <CText sx={styles.sectionTitle} fontSize={20} fontWeight={600}>Requirements</CText>
        <FlatList
          data={jobDetails.requirements}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Icon name="circle" size={10} color="#555" />
              <CText sx={styles.listText}>{item.text}</CText>
            </View>
          )}
        />
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      {/* Reviews Section */}
      <View style={styles.card}>
        <CText sx={styles.sectionTitle} fontSize={20} fontWeight={600}>Employee Reviews</CText>
        <FlatList
          data={reviews}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          snapToAlignment="center"
          decelerationRate="fast"
          snapToInterval={320}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Icon name="user-circle" size={30} color="#333" />
                <CText sx={styles.reviewName} fontSize={16} fontWeight={600}>{item.name}</CText>
              </View>
              <CText sx={styles.reviewText}>{item.text}</CText>
              <View style={styles.reviewRating}>
                {[...Array(5)].map((_, index) => (
                  <Icon key={index} name="star" size={18} color={index < Math.floor(item.rating) ? '#FFD700' : '#ccc'} />
                ))}
                <Text style={styles.reviewRatingText}>{item.rating}/5</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteReview(item.id)} style={styles.deleteButton}>
                <CText style={styles.deleteButtonText} fontWeight={600} color={"#fff"}>Delete</CText>
              </TouchableOpacity>
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
        <CText sx={styles.sectionTitle} fontSize={20} fontWeight={600}>Applicants</CText>
        <FlatList
          data={applicants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleApplicantCardPress(item.id)} style={styles.applicantCard}>
              <View>
                <CText sx={styles.applicantName} fontSize={18} fontWeight={600}>{item.name}</CText>
                <CText sx={styles.applicantPosition}>{item.position}</CText>
              </View>
              <CText color={"#0017ff"} sx={{marginTop:8}}>View Details</CText>
            </TouchableOpacity>
          )}
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
    width: 320,
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
