import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import CText from '../../components/CText';
import { getUserData } from '../../services/UserDataService';
import { getJobPost } from '../../services/JobPostService';
import { ActivityIndicator } from 'react-native-paper';
import { getCompany } from '../../services/CompanyService';

const { width } = Dimensions.get('window');

// Sample data for job applications
const jobApplicationsData = [
  { id: '1', jobTitle: 'Software Developer', status: 'Open', location: 'New York', applicants: 30 },
  { id: '2', jobTitle: 'Data Scientist', status: 'Closed', location: 'San Francisco', applicants: 25 },
  { id: '3', jobTitle: 'UI/UX Designer', status: 'Open', location: 'Los Angeles', applicants: 10 },
];

const CompaniesList = () => {
  const navigate = useNavigation();
  const [companiesData, setCompaniesData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // Fetch job posts data
    const fetchData = async () => {
      try {
        const comData = await getCompany(undefined, undefined);
        setCompaniesData(comData);
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
      <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
        <ActivityIndicator animating={true} color={"#000"} size={"large"} />
      </View>
    );
  }

  // Render function for Job Application Card
  // const navigate = useNavigation();
  const renderCompanyItem = ({ item }) => {
  
    return (
      <TouchableOpacity 
        style={styles.companyCard} 
        onPress={() => navigate.navigate('Home', { screen: 'CompanyDetail', params: { companyId: item.id } })}
      >
        <View style={styles.companyContent}>
          {/* Left side (Company details) */}
          <View style={styles.companyDetails}>
            <CText fontWeight={600} sx={styles.companyName}>{item.company_name}</CText>
            <CText sx={styles.companyLocation}>
              {/* <Icon name="mail" size={16} color="#5B5B5B" /> {item.company_email} */}
            </CText>
            <CText sx={styles.companyDescription}>{item.company_description}</CText>
            
            {/* Contact/Website */}
            {item.website && (
              <TouchableOpacity onPress={() => Linking.openURL(item.website)}>
                <CText sx={styles.websiteLink}>Visit Website</CText>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Right side (Company Logo) */}
          <Image source={{ uri: item.company_logo }} style={styles.companyLogo} resizeMode="contain" />
        </View>
      </TouchableOpacity>
    );
  };
  
  

  return (
    <View style={styles.container}>

      {/* Job Applications Section */}
      <View style={styles.sectionHeader}>
        <CText fontWeight={600} sx={styles.sectionTitle}>Companies</CText>
      </View>

      <FlatList
        data={companiesData}
        renderItem={renderCompanyItem}
        keyExtractor={(item) => item.job_post_id}
        // Optional for horizontal scrolling
        // snapToInterval={width * 0.9}
        // decelerationRate="fast"
        // snapToAlignment="center"
        // pagingEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    paddingBottom:140
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
  companyCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    margin: 8,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: 'row', // Use row layout for left and right side
    alignItems: 'center', // Center vertically in the row
  },
  companyContent: {
    flexDirection: 'row', // Make company content layout horizontal
    justifyContent: 'space-between', // Space between left and right sides
    width: '100%', // Ensure the content takes full width
  },
  companyDetails: {
    flex: 1, // Left side takes available space
    marginRight: 10, // Add space between the text content and logo
  },
  companyName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333', // Dark text color for company name
    marginBottom: 5,
  },
  companyLocation: {
    fontSize: 14,
    color: '#555', // Lighter color for location
    marginBottom: 5,
  },
  companyDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  websiteLink: {
    color: '#007bff',
    fontSize: 16,
    marginTop: 10,
  },
  companyLogo: {
    width: 80,
    height: 80,
    borderRadius: 8, // Rounded corners for the logo
  },
});

export default CompaniesList;
