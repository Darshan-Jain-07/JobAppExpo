// src/screens/ApplicantDetails.js

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // For icons like email, phone
import { useRoute, useNavigation } from '@react-navigation/native'; // For navigation and routing
import CChip from '../../components/CChip';

const ApplicantDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();

//   const { applicant } = route.params; // Receive applicant data passed via navigation
  const applicant = {
    id: '4',
    name: 'Emily Clark',
    position: 'Mobile Developer',
    profilePicture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbpF3IRjq3K2vF74PNI4mpc-kzYwXmegSupg&s', // Replace with a real URL or placeholder
    email: 'emily.clark@example.com',
    phone: '+1 (123) 456-7890',
    skills: ['React Native', 'JavaScript', 'UI/UX Design', 'RESTful APIs', 'Git'],
    experience: '3 years of experience in mobile application development, including 2 years working with React Native and cross-platform development.',
    resume: 'https://example.com/resumes/emily_clark_resume.pdf', // Optional resume link
    education: 'Bachelor of Science in Computer Science, XYZ University, 2019',
    location: 'New York, NY',
  };
  // Receive applicant data passed via navigation

  const handleResumeDownload = () => {
    // Handle resume download logic (e.g., open a URL or download file)
    console.log('Resume download for:', applicant.name);
  };

  return (
    <ScrollView style={styles.container}>
      

      {/* Applicant Info */}
      <View style={styles.profileSection}>
        {console.log(applicant?.profilePicture)}
        <Image style={styles.profileImage} source={{ uri: applicant?.profilePicture }} />
        <Text style={styles.applicantName}>{applicant?.name}</Text>
        <Text style={styles.applicantPosition}>{applicant?.position}</Text>
      </View>

      {/* Contact Info */}
      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.contactItem}>
          <Icon name="envelope" size={20} color="#333" />
          <Text style={styles.contactText}>{applicant?.email}</Text>
        </View>
        <View style={styles.contactItem}>
          <Icon name="phone" size={20} color="#333" />
          <Text style={styles.contactText}>{applicant?.phone}</Text>
        </View>
      </View>

      {/* Skills */}
      <View style={styles.skillsSection}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.skillsList}>
          {applicant?.skills.map((skill, index) => (
            <CChip key={index} text={skill} />
          ))}
        </View>
      </View>

      {/* Experience */}
      <View style={styles.experienceSection}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <View style={styles.experienceItem}>
          <Text style={styles.experienceText}>{applicant?.experience}</Text>
        </View>
      </View>

      {/* Resume */}
      <View style={styles.resumeSection}>
        <Text style={styles.sectionTitle}>Resume</Text>
        <TouchableOpacity style={styles.downloadButton} onPress={handleResumeDownload}>
          <Text style={styles.downloadButtonText}>Download Resume</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginLeft: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  applicantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  applicantPosition: {
    fontSize: 18,
    color: '#777',
  },
  contactSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#555',
  },
  skillsSection: {
    marginBottom: 30,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    backgroundColor: '#1E90FF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  skillText: {
    color: '#fff',
    fontSize: 14,
  },
  experienceSection: {
    marginBottom: 30,
  },
  experienceItem: {
    marginBottom: 10,
  },
  experienceText: {
    fontSize: 16,
    color: '#555',
  },
  resumeSection: {
    marginBottom: 130,
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ApplicantDetails;
