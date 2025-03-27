import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import CText from "../../components/CText";
import { useNavigation } from "@react-navigation/native";

// Dummy data
const companyData = {
  name: "TechCorp",
  logo: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
  description:
    "TechCorp is a leading software company specializing in AI and blockchain.",
  location: "San Francisco, CA",
  website: "https://www.techcorp.com",
};

const recruiters = [
  { id: "1", name: "John Doe", position: "HR Manager" },
  { id: "2", name: "Jane Smith", position: "Talent Acquisition Lead" },
  { id: "3", name: "Alice Cooper", position: "Recruitment Specialist" },
  { id: "4", name: "Bob Martin", position: "Senior HR Specialist" },
  { id: "5", name: "Emma White", position: "Lead Recruiter" },
];

const jobPosts = [
  {
    id: "1",
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "Remote",
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    location: "San Francisco",
  },
];

// Main component for the company profile screen
const CompanyProfileScreen = () => {
  const navigation = useNavigation();
  // Function to render recruiter
  const renderRecruiter = ({ item }) => (
    <View style={styles.recruiterCard} key={item.id}>
      {/* Add unique key prop */}
      <Image
        source={{ uri: "https://www.example.com/recruiter-placeholder.png" }}
        style={styles.recruiterImage}
      />
      <CText fontWeight={600} sx={styles.recruiterName}>
        {String(item.name || "No Name")}
      </CText>
      <CText sx={styles.recruiterPosition}>
        {String(item.position || "No Position")}
      </CText>
      <TouchableOpacity
        onPress={() => navigation.navigate("ChatReact")}
        style={styles.viewProfileButton}
      >
        <CText sx={styles.buttonText}>Chat Now</CText>
      </TouchableOpacity>
    </View>
  );

  // Function to render job post
  const renderJobPost = ({ item }) => (
    <View style={styles.jobPostCard} key={item.id}>
      {/* Add unique key prop */}
      <CText fontWeight={600} sx={styles.jobPostTitle}>
        {String(item.title || "No Title")}
      </CText>
      <CText sx={styles.jobPostDepartment}>
        {String(item.department || "No Department")}
      </CText>
      <CText sx={styles.jobPostLocation}>
        {String(item.location || "No Location")}
      </CText>
      <TouchableOpacity style={styles.applyButton}>
        <CText sx={styles.buttonText}>Apply Now</CText>
      </TouchableOpacity>
    </View>
  );

  // Render function for company info (to be used as ListHeaderComponent)
  const renderCompanyInfo = () => (
    <View style={styles.companyInfoContainer}>
      <Image source={{ uri: companyData.logo }} style={styles.companyLogo} />
      <CText sx={styles.companyName} fontWeight={600}>
        {companyData.name}
      </CText>
      <CText sx={styles.companyDescription}>{companyData.description}</CText>
      <CText sx={styles.companyLocation}>{companyData.location}</CText>
      <TouchableOpacity onPress={() => Linking.openURL(companyData.website)}>
        <CText sx={styles.companyWebsiteText}>{companyData.website}</CText>
      </TouchableOpacity>
    </View>
  );

  // Flatten the data into one array with keys indicating the section type
  const data = [
    { type: "company", content: companyData },
    { type: "recruiter", content: recruiters },
    { type: "jobPost", content: jobPosts },
  ];

  // Function to render each item based on its type
  const renderItem = ({ item }) => {
    if (item.type === "company") {
      return renderCompanyInfo();
    } else if (item.type === "recruiter") {
      return (
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {item.content.map((recruiter) => (
              <View key={recruiter.id}>
                {renderRecruiter({ item: recruiter })}
              </View> // Ensure key is assigned here as well
            ))}
          </ScrollView>
          <View style={{ height: 10 }}></View>
        </View>
      );
    } else if (item.type === "jobPost") {
      return (
        <FlatList
          data={item.content}
          renderItem={renderJobPost}
          keyExtractor={(job) => job.id}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()} // Use index for the sections
        renderItem={renderItem}
        ListFooterComponent={<View style={styles.footer}></View>}
      />
      <Text>Hello</Text>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  companyInfoContainer: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  companyLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 24,
    color: "#333",
  },
  companyDescription: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginVertical: 10,
  },
  companyLocation: {
    fontSize: 16,
    color: "#777",
    marginBottom: 10,
  },
  companyWebsite: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  companyWebsiteText: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  recruiterCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: 150,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  recruiterImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  recruiterName: {
    fontSize: 16,
    color: "#333",
  },
  recruiterPosition: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  viewProfileButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  jobPostCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  jobPostTitle: {
    fontSize: 16,
    color: "#333",
  },
  jobPostDepartment: {
    fontSize: 14,
    color: "#555",
  },
  jobPostLocation: {
    fontSize: 14,
    color: "#777",
    marginVertical: 5,
  },
  applyButton: {
    backgroundColor: "#28a745",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  footer: {
    height: 90,
  },
});

export default CompanyProfileScreen;
