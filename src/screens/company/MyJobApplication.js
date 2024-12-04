import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { Icon } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Sample data for job posts
const jobPosts = [
  {
    id: '1',
    jobTitle: 'Software Engineer',
    recruiterName: 'John Doe',
    company: 'TechCorp',
    status: 'Open',
    recruiterImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgiFdgv377GbHewlOp8pafN1iCpITSEyXr0A&s', // Example image URL
  },
  {
    id: '2',
    jobTitle: 'Product Manager',
    recruiterName: 'Jane Smith',
    company: 'InnovateX',
    status: 'Closed',
    recruiterImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuQEOS-b83YWOSeYdBzWWsEeENYrajb8sROQ&s', // Example image URL
  },
  {
    id: '3',
    jobTitle: 'UX/UI Designer',
    recruiterName: 'Alice Johnson',
    company: 'Designify',
    status: 'Open',
    recruiterImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZEqTQqHH6VL5BJfsCes8n9aLdekV7_nqBA&s', // Example image URL
  },
  // Add more sample data as needed
];

const JobPostsScreen = () => {
  const [searchText, setSearchText] = useState('');

  // Filter the job posts based on search text (by recruiter name or job title)
  const filteredJobPosts = jobPosts.filter(
    (job) =>
      job.id.toLowerCase().includes(searchText.toLowerCase()) ||
      job.jobTitle.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.jobCard}>
      <Image source={{ uri: item.recruiterImage }} style={styles.recruiterImage} />
      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle}>{item.jobTitle}</Text>
        <Text style={styles.recruiterName}>{item.recruiterName}</Text>
        <Text style={styles.company}>{item.company}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
      <TouchableOpacity style={styles.viewButton}>
      <Icon name="chevron-right" size={30} color="#888" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by recruiter name or job title"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Icon name="search" size={24} type="font-awesome" color="#999" />
        </TouchableOpacity>
      </View>

      {/* Job Posts List */}
      {filteredJobPosts.length > 0 ? (
        <FlatList
          data={filteredJobPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Image
            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyPNwnCcYGqGbL0kS_cUJ3nJ25_gP337Sm3g&s' }} // Placeholder image when no results are found
            style={styles.noResultsImage}
          />
          <Text style={styles.noResultsText}>No job posts found for "{searchText}"</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  searchContainer: {
    // flexDirection: 'row',
    flexDirection: 'row', // To make TextInput and icon sit next to each other
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchBar: {
    height: 45,
    flex: 1,
    fontSize: 16,
  },
  searchIcon: {
    paddingRight: 12,
  },
  listContainer: {
    paddingBottom: 16,
  },
  jobCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  recruiterImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recruiterName: {
    fontSize: 16,
    color: '#555',
  },
  company: {
    fontSize: 14,
    color: '#888',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  viewButton: {
    // backgroundColor: '#007BFF',
    // borderRadius: 5,
    // paddingVertical: 8,
    // paddingHorizontal: 16,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default JobPostsScreen;
