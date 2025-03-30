import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CText from "../../components/CText";
import { getUserData } from "../../services/UserDataService";
import { getJobPost } from "../../services/JobPostService";
import { getRecruiter } from "../../services/RecruiterService";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Provider, RadioButton } from "react-native-paper";

const JobPostsScreen = ({ route }) => {
  const valueParam = route?.params?.valueParam || "first";
  console.log(valueParam);
  const isFocus = useIsFocused();
  const [searchText, setSearchText] = useState("");
  const [jobPosts, setJobPosts] = useState([]);
  const [recruiters, setRecruiters] = useState({});
  const [userData, setUserData] = useState();
  const [value, setValue] = useState(valueParam); // Radio button value
  const navigation = useNavigation();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState("first"); // Default selection

  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoaded(false);
      let jobPost;
      console.log(userData?.company_email, value, "userInfosdfsd");
      if (value === "first") {
        jobPost = await getJobPost(null, userData?.recruiter_id);
      } else {
        userData?.company_email_id ? jobPost = await getJobPost(userData?.company_email_id) : jobPost = [];
        console.log(jobPost);
        const recruiterData = {};
        for (let job of jobPost) {
          const recruiterInfo = await getRecruiter(
            null,
            null,
            job?.recruiter_id
          );
          recruiterData[job?.recruiter_id] = recruiterInfo?.[0]; // Map recruiter data
        }
        setRecruiters(recruiterData); // Save recruiters' data in state
      }
      setIsDataLoaded(true);
      setJobPosts(jobPost);
    };

    fetchData();
  }, [value, isFocus]);

  useEffect(() => {
    setValue(valueParam);
  }, [valueParam]);

  // Fetch job posts data
  useEffect(() => {
    const fetchData = async () => {
      let userInfo = await getUserData();
      setUserData(userInfo);

      let jobPost;
      console.log(userInfo?.company_email, "sdfsdfsdf")
      if (valueParam === "first") {
        jobPost = await getJobPost(null, userInfo?.recruiter_id);
      } else {
        jobPost = await getJobPost(userInfo?.company_email);
      }
      setJobPosts(jobPost);

      // Fetch recruiters' information for each job post
      const recruiterData = {};
      for (let job of jobPost) {
        const recruiterInfo = await getRecruiter(null, null, job?.recruiter_id);
        recruiterData[job?.recruiter_id] = recruiterInfo?.[0]; // Map recruiter data
      }
      setIsDataLoaded(true);
      setRecruiters(recruiterData); // Save recruiters' data in state
    };

    fetchData(); // Call fetchData when the component mounts
  }, []); // Only call once when the component is mounted

  // Filter the job posts based on search text (by recruiter name or job title)
  const filteredJobPosts = jobPosts?.filter(
    (job) =>
      job?.job_post_id?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
      job?.job_post_name?.toLowerCase()?.includes(searchText?.toLowerCase())
  );

  if (!isDataLoaded) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <ActivityIndicator animating={true} color={"#000"} size={"large"} />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const recData = recruiters[item?.recruiter_id]; // Get recruiter data from state
    return (
      <View style={styles.jobCard}>
        {recData && (
          <Image
            source={{ uri: recData?.recruiter_image }}
            style={styles.recruiterImage}
          />
        )}
        <View style={styles.jobInfo}>
          <CText fontWeight={600} sx={styles.jobTitle}>
            {item.job_post_name}
          </CText>
          {recData && (
            <CText sx={styles.recruiterName}>{recData?.recruiter_name}</CText>
          )}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <CText>Status: </CText>
            <CText fontWeight={600} sx={styles.status}>
              {item.is_deleted === "False" ? "Available" : "Unavailable"}
            </CText>
          </View>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate("ApplicationDetail", {
              applicationId: item.job_post_id,
            })
          }
        >
          <Icon name="chevron-right" size={30} color="#888" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        {/* RadioButton Group */}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search by recruiter name or job title"
            value={searchText}
            onChangeText={setSearchText} // Update search text state
          />
          <TouchableOpacity style={styles.searchIcon}>
            <Icon name="search" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* <RadioButton.Group
          onValueChange={(newValue) => setValue(newValue)} // Change radio button value
          value={value} // Controlled radio button value
        >
          <View style={styles.radioButton}>
            <RadioButton.Item label="Your's Job Post" value="first" />
            <RadioButton.Item label="Company's Job Post" value="second" />
          </View>
        </RadioButton.Group> */}

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === "first" && styles.activeTab,
            ]}
            onPress={() => {
              setSelectedTab("first");
              setValue("first"); // Ensure data is fetched accordingly
            }}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "first" && styles.activeTabText,
              ]}
            >
              Your's Job Post
            </Text>
          </TouchableOpacity>
          {userData?.company_email_id && <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === "second" && styles.activeTab,
            ]}
            onPress={() => {
              setSelectedTab("second");
              setValue("second"); // Ensure data is fetched accordingly
            }}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "second" && styles.activeTabText,
              ]}
            >
              Company's Job Post
            </Text>
          </TouchableOpacity>}
        </View>
        {/* Job Posts List */}
        {filteredJobPosts.length > 0 ? (
          <FlatList
            data={filteredJobPosts}
            renderItem={renderItem}
            keyExtractor={(item) => item.job_post_id}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Image
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyPNwnCcYGqGbL0kS_cUJ3nJ25_gP337Sm3g&s",
              }} // Placeholder image when no results are found
              style={styles.noResultsImage}
            />
            <Text style={styles.noResultsText}>
              No job posts found for "{searchText}"
            </Text>
          </View>
        )}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
    marginBottom: 70,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
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
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
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
  },
  recruiterName: {
    fontSize: 16,
    color: "#555",
  },
  status: {
    fontSize: 14,
    color: "#007BFF",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    color: "#555",
  },
  activeTab: {
    backgroundColor: "#000",
  },
  activeTabText: {
    color: "white",
    fontWeight: "bold",
  },
  listItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
});

export default JobPostsScreen;
