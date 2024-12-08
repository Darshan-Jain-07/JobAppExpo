import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing an icon library
import CText from '../../components/CText';

const RecruiterList = () => {
    const navigation = useNavigation()
  // Simulating recruiter data (you would fetch this from an API or database)
  const allRecruiters = [
    { id: '1', name: 'John Doe', position: 'Senior Recruiter', company: 'TechCorp' },
    { id: '2', name: 'Jane Smith', position: 'Recruiter', company: 'WebSolutions' },
    { id: '3', name: 'Michael Brown', position: 'Lead Recruiter', company: 'Appify' },
    { id: '4', name: 'Emily Davis', position: 'Recruitment Manager', company: 'InnovateTech' },
    { id: '5', name: 'Chris Wilson', position: 'HR Specialist', company: 'DesignPro' },
  ];

  const [recruiters, setRecruiters] = useState(allRecruiters);
  const [searchQuery, setSearchQuery] = useState(''); // For storing the search query

  // Function to handle search filter
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setRecruiters(allRecruiters); // If search is empty, show all recruiters
    } else {
      const filteredRecruiters = allRecruiters.filter(
        (recruiter) =>
          recruiter.name.toLowerCase().includes(query.toLowerCase()) ||
          recruiter.id.includes(query) // Filter by name or ID
      );
      setRecruiters(filteredRecruiters);
    }
  };

  // Render each recruiter item
  const renderRecruiterItem = ({ item }) => (
    <View style={styles.recruiterCard}>
      <View style={styles.recruiterInfo}>
        <Icon name="person" size={30} color="#4CAF50" style={styles.recruiterIcon} />
        <View style={styles.textContainer}>
          <CText fontWeight={600} sx={styles.name}>{item.name}</CText>
          <CText sx={styles.position}>{item.position}</CText>
          <CText sx={styles.company}>{item.company}</CText>
        </View>
      </View>
      <TouchableOpacity onPress={()=>navigation.navigate('Recruiters', { screen: 'RecruiterDetail' })} style={styles.viewDetailsIcon}>
        <Icon name="chevron-right" size={30} color="#888" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar with Icon on the Right */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or ID"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={() => handleSearch(searchQuery)} style={styles.searchIconContainer}>
          <Icon name="search" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* No results found image */}
      {recruiters.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Image source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyPNwnCcYGqGbL0kS_cUJ3nJ25_gP337Sm3g&s"}} style={styles.noResultsImage} />
          <Text style={styles.noResultsText}>No Recruiter found for "{searchQuery}"</Text>
        </View>
      ) : (
        <FlatList
          data={recruiters}
          renderItem={renderRecruiterItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
      <View style={{marginBottom:70}}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    marginTop: 10,
  },
  recruiterCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recruiterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recruiterIcon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    color: '#333',
  },
  position: {
    fontSize: 14,
    color: '#555',
  },
  company: {
    fontSize: 10,
    color: '#888',
  },
  viewDetailsIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  searchBarContainer: {
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
  searchInput: {
    height: 45,
    flex: 1,
    fontSize: 16,
  },
  searchIconContainer: {
    paddingRight: 12,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: '#888',
  },
});

export default RecruiterList;
