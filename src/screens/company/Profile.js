import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SectionList,
  TouchableOpacity,
} from "react-native";
import { ActivityIndicator, Avatar, Modal } from "react-native-paper";
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
  const [currentSubscription, setCurrentSubscription] = useState({});
  const [currentSubscriptionData, setCurrentSubscriptionData] = useState({});
  const isFocus = useIsFocused();

  useEffect(() => {
    // Define an async function inside the useEffect
    const fetchData = async () => {
      try {
        const data = await getUserData();
        setUserDate(data);
        console.log(data);

        let currentSub = await getSubscriptionMapping(data?.company_id, "0")
        console.log(currentSub.length, "------------->")

        if (currentSub?.length) {
          let curSubData = await getSubscription(null, null, currentSub?.[0]?.subscription_id)
          console.log(curSubData)
          setCurrentSubscription(currentSub?.[0])
          setCurrentSubscriptionData(curSubData?.[0])
        } else {
          setCurrentSubscription("No Subscription")
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
      title: "Company Details",
      data: [
        {
          key: "view",
          text: "View Company",
          icon: "building",
          onPress: () => {
            navigate.navigate("View Company Detail");
          },
        },
        {
          key: "edit",
          text: "Edit Company Details",
          icon: "edit",
          onPress: () => navigation.navigate("Sign Up Company"),
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
          onPress: () => {
            navigate.navigate("Create Blog");
          },
        },
        {
          key: "viewBlog",
          text: "View Blogs",
          icon: "file-text",
          onPress: () => {
            navigate.navigate("Blog List");
          },
        },
        {
          key: "myBlog",
          text: "My Blogs",
          icon: "edit",
          onPress: () => {
            navigate.navigate("Blog List", { userId: userData?.company_id });
          },
        },
      ],
    },
    {
      title: "Subscription",
      data: [
        { key: "mySubscription", text: "My Subscription", icon: "gift", onPress: () => setModalVisible(true), },
        {
          key: "viewSubscription",
          text: "View All Subscription",
          icon: "list",
          onPress: () => { navigate.navigate("Subscription") }
        },
        { key: "paymentHistory", text: "Payment History", icon: "credit-card", onPress: () => { navigate.navigate("Home", { screen: "Payment History" }) } },
      ],
    },
    {
      title: "Job Post",
      data: [
        {
          key: "myRecruiter",
          text: "My Recruiters",
          icon: "users",
          onPress: () => {
            navigate.navigate("Recruiters", { screen: "MyRecruiter" });
          },
        },
        {
          key: "myJobApplication",
          text: "My Job Posts",
          icon: "briefcase",
          onPress: () => {
            navigate.navigate("Applications", { screen: "MyJobApplication" });
          },
        },
      ],
    },
    {
      title: "Help",
      data: [
        {
          key: "HAS",
          text: "Help & Support",
          icon: "support",
          onPress: () => {
            navigate.navigate("FAQ");
          },
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
      <CText fontWeight={600} style={styles.sectionHeaderText}>
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
        <Avatar.Image
          source={{ uri: userData?.company_logo }} // Replace with dynamic company logo URL
          size={80}
        />
        <View style={styles.companyInfo}>
          <CText fontWeight={600} sx={styles.companyName}>
            {userData?.company_name}
          </CText>
          <CText sx={styles.companyEmail}>{userData?.company_email}</CText>
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

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          {currentSubscription !== "No Subscription" ? <View style={styles.modalContent}>
            <CText sx={styles.modalTitle} fontWeight={700}>My Subscription Details</CText>
            <CText sx={styles.modalText}>
              <CText sx={styles.bold} fontWeight={600}>Subscription:</CText> {currentSubscriptionData?.subscription_name || "Custom Plan"}
            </CText>
            {/* <CText sx={styles.modalText}>
                    <CText sx={styles.bold} fontWeight={600}>Start Date:</CText> {dayjs(currentSubscription?.subscription_mapping_start_date).format("DD/MM/YYYY")}
                  </CText>
                  <CText sx={styles.modalText}>
                    <CText sx={styles.bold} fontWeight={600}>Renewal Date:</CText> {dayjs(currentSubscription?.subscription_mapping_end_date).format("DD/MM/YYYY")}
                  </CText> */}
            <CText sx={styles.modalText}>
              <CText sx={styles.bold} fontWeight={600}>Job Post Creation Left:</CText> {currentSubscription?.subscription_mapping_application_left}
            </CText>
            <CText sx={styles.modalText}>
              <CText sx={styles.bold} fontWeight={600}>Recruiter Left:</CText> {currentSubscription?.subscription_mapping_recruiter}
            </CText>
            {/* <CText sx={styles.modalText}>
              <CText sx={styles.bold} fontWeight={600}>Cost:</CText> {currentSubscriptionData?.subscription_price}
            </CText> */}
            <CText sx={{ ...styles.modalText, textAlign: "center", fontSize: 12 }}>
              For more detail you can check Subscription Detail by clicking on All Subscription
            </CText>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <CText sx={styles.closeButtonText}>Close</CText>
            </TouchableOpacity>
          </View> : <View style={styles.modalContent}>
            <CText sx={styles.modalTitle} fontWeight={700}>No Active Subscription</CText>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <CText sx={styles.closeButtonText}>Close</CText>
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
    marginBottom: 100,
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
    marginHorizontal: 10,
    marginBottom: 8,
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
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    marginBottom: 15,
    color: "#2c3e50",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#34495e",
  },
  bold: {
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
  },
});

export default ProfilePage;
