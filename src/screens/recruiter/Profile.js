import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, SectionList, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can choose any icon set
import { getCompanyData } from '../../services/ProfileService';
import { clearUserData, getUserData } from '../../services/UserDataService';
import { useNavigation } from '@react-navigation/native';
import CText from '../../components/CText';

const ProfilePage = ({ navigation }) => {
  const [userData, setUserDate] = useState();
  const navigate = useNavigation();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // Define an async function inside the useEffect
    const fetchData = async () => {
      try {
        const data = await getUserData();
        setUserDate(data)
        console.log(data);
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsDataLoaded(true);
      }
    };

    // Call the async function
    fetchData();
  }, []);

  
  if (!isDataLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
        <ActivityIndicator animating={true} color={"#000"} size={"large"} />
      </View>
    )
  }

  // Define the sections with their respective options and icons
  const sections = [
    {
      title: 'Your Details',
      data: [
        { key: 'view', text: 'View Details', icon: 'eye', onPress:()=>{navigation.navigate("View Recruiter Detail")} },
        { key: 'edit', text: 'Edit Details', icon: 'edit', onPress:() => navigation.navigate("Sign Up Recruiter") },
      ],
    },
    {
      title: 'Blog',
      data: [
        { key: 'Create Blog', text: 'Write Blog', icon: 'pencil', onPress: () => { navigate.navigate("Create Blog")} },
        { key: 'viewBlog', text: 'View Blogs', icon: 'file-text', onPress:() => { navigate.navigate("Blog List")} },
        { key: 'myBlog', text: 'My Blogs', icon: 'edit', onPress:() => { navigate.navigate("Blog List", { userId: userData?.recruiter_id })} },
      ],
    },
    {
      title: 'Subscription',
      data: [
        { key: 'mySubscription', text: 'My Subscription', icon: 'gift' },
        { key: 'viewSubscription', text: 'View All Subscription', icon: 'list' },
        { key: 'paymentHistory', text: 'Payment History', icon: 'credit-card' },
      ],
    },
    {
      title: 'Job Post',
      data: [
        { key: 'companyJobApplication', text: 'Company Job Post', icon: 'building-o', onPress:() => navigate.navigate('Recruiters', { screen: "MyRecruiter", params: { valueParam:"second"} })} ,
        { key: 'myJobApplication', text: 'My Job Posts', icon: 'briefcase', onPress:() => navigate.navigate('Recruiters', { screen: "MyRecruiter", params: { valueParam:"first"} })} ,
      ],
    },
    {
      title: 'Other',
      data: [
        { key: 'logout', text: 'Logout', icon: 'sign-out', onPress:()=>{clearUserData(); navigate.navigate("Splash")} },
      ],
    },
  ];

  // Render each section header and item
  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <CText fontWeight={600} style={styles.sectionHeaderText}>{section.title}</CText>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.optionButton}
      onPress={item.onPress} // Navigate to the respective screen
    >
      <View style={styles.optionContent}>
        <Icon name={item.icon} size={20} color="#000" />
        <CText sx={styles.optionText}>{item.text}</CText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Company Logo and Details */}
      <View style={styles.headerContainer}>
        <Avatar.Image
          source={{ uri: userData?.recruiter_image }} // Replace with dynamic company logo URL
          size={80}
        />
        <View style={styles.companyInfo}>
          <CText fontWeight={600} sx={styles.companyName}>{userData?.recruiter_name}</CText>
          <CText sx={styles.companyEmail}>{userData?.recruiter_email}</CText>
        </View>
      </View>

      {/* Sectioned Options List */}
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.key + index}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginBottom:100
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  companyInfo: {
    marginLeft: 16,
  },
  companyName: {
    fontSize: 22,
    color: '#333',
  },
  companyEmail: {
    fontSize: 14,
    color: '#777',
  },
  sectionHeader: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  optionButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
  },
});

export default ProfilePage;
