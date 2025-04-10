import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SectionList,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { ActivityIndicator, Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome"; // You can choose any icon set
import { getCompanyData } from "../../services/ProfileService";
import { clearUserData, getUserData } from "../../services/UserDataService";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import CText from "../../components/CText";
import { getSubscription, getSubscriptionMapping } from "../../services/SubscriptionService";

const ProfilePage = ({ navigation }) => {
  const [userData, setUserDate] = useState();
  const navigate = useNavigation();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSubscriptionData, setCurrentSubscriptionData] = useState({});
  const [subscriptionData, setSubscriptionData] = useState({});
  const isFocus = useIsFocused();

  useEffect(() => {
    // Define an async function inside the useEffect
    const fetchData = async () => {
      try {
        const data = await getUserData();
        setUserDate(data);
        console.log(userData?.applicant_id);

        let subData = await getSubscriptionMapping(data?.applicant_id, "0")
        if (subData?.length) {
          let curSubData = await getSubscription(null, null, subData?.[0]?.subscription_id)
          setSubscriptionData(subData?.[0])
          setCurrentSubscriptionData(curSubData?.[0])
        } else {
          setSubscriptionData("No Subscription")
        }
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsDataLoaded(true);
      }
    };

    // Call the async function
    fetchData();
  }, [isFocus]);

  if (!isDataLoaded) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <ActivityIndicator animating={true} color={"#000"} size={"large"} />
      </View>
    );
  }
  // Define the sections with their respective options and icons
  const sections = [
    {
      title: "Recruiter Details",
      data: [
        {
          key: "view",
          text: "View Your Details",
          icon: "eye",
          onPress: () => {
            navigation.navigate("View Applicant Detail");
          },
        },
        // { key: 'edit', text: 'Edit Login Details', icon: 'edit', onPress:() => navigation.navigate("Sign Up Applicant") },
        {
          key: "edit",
          text: "Edit Resume Details",
          icon: "edit",
          onPress: () => navigation.navigate("Resume Form"),
        },
      ],
    },
    {
      title: "Blog",
      data: [
        {
          key: "Create Blog",
          text: "Write Blog",
          icon: "pencil",
          onPress: () => navigation.navigate("Create Blog Applicant"),
        },
        {
          key: "viewBlog",
          text: "View Blog",
          icon: "file-text",
          onPress: () => navigation.navigate("Blog List"),
        },
        {
          key: "myBlog",
          text: "My Blog",
          icon: "file-text",
          onPress: () =>
            navigation.navigate("Blog List", {
              userId: userData?.applicant_id,
            }),
        },
      ],
    },
    {
      title: "Subscription",
      data: [
        {
          key: "mySubscription",
          text: "My Subscription",
          icon: "gift",
          onPress: () => setModalVisible(true),
        },
        {
          key: "viewSubscription",
          text: "View All Subscription",
          icon: "list",
          onPress: () => navigation.navigate("Subscription"),
        },
        {
          key: "paymentHistory",
          text: "Payment History",
          icon: "credit-card",
          onPress: () => navigation.navigate("Payment History"),
        },
      ],
    },
    {
      title: "Job Application",
      data: [
        {
          key: "myJobApplication",
          text: "My Job Application",
          icon: "briefcase",
          onPress: () =>
            navigation.navigate("Jobs", {
              screen: "Job Post List",
              params: { mine: true },
            }),
        },
      ],
    },
    {
      title: "Other",
      data: [
        {
          key: "logout",
          text: "Logout",
          icon: "sign-out",
          onPress: () => {
            clearUserData();
            navigate.navigate("Splash");
          },
        },
      ],
    },
  ];

  // Render each section header and item
  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <CText fontWeight={600} sx={styles.sectionHeaderText}>
        {section.title}
      </CText>
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
        {/* <Avatar.Image
          source={{ uri: userData?.applicant_image }} // Replace with dynamic company logo URL
          size={80}
        /> */}
        <View style={styles.companyInfo}>
          <CText fontWeight={600} sx={styles.companyName}>
            {userData?.applicant_name}
          </CText>
          <CText sx={styles.companyEmail}>{userData?.applicant_email}</CText>
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

      {/* Modal for My Subscription */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          {subscriptionData !== "No Subscription" ? <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>My Subscription Details</Text>
            <Text style={styles.modalText}>
              <Text style={styles.bold}>Subscription Plan:</Text> {currentSubscriptionData?.subscription_name}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.bold}>Job Apply Left:</Text> {subscriptionData?.subscription_mapping_application_left}
            </Text>
            {/* <Text style={styles.modalText}>
              <Text style={styles.bold}>Renewal Date:</Text> 01 March 2026
            </Text> */}
            <Text style={styles.modalText}>
              <Text style={styles.bold}>Cost:</Text> {currentSubscriptionData?.subscription_price}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.bold}>Subscriber Name:</Text> {userData?.applicant_name}
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View> : <View style={styles.modalContent}>
            <Text style={{...styles.modalTitle, color:"red"}}>No Active Subscription</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    // marginBottom:100
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
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
    color: "#333",
  },
  companyEmail: {
    fontSize: 14,
    color: "#777",
  },
  sectionHeader: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  sectionHeaderText: {
    fontSize: 18,
    color: "#333",
  },
  optionButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2c3e50",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#34495e",
  },
  bold: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfilePage;
