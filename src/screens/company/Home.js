import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import CStatisticsCard from "../../components/CIconStatisticsCard";
import CText from "../../components/CText";
import { getUserData } from "../../services/UserDataService";
import { getRecruiter } from "../../services/RecruiterService";
import { ActivityIndicator } from "react-native-paper";
import { getJobPost } from "../../services/JobPostService";
import { getBlog } from "../../services/BlogService";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getSubscription, getSubscriptionMapping } from "../../services/SubscriptionService";
import { appliedJob } from "../../services/ApplicationService";

const { width } = Dimensions.get("window"); // Get screen width for responsive design

const features = [
  {
    id: "1",
    title: "Smart Job Matching",
    description:
      "AI-powered recommendations based on skills, experience, and preferences.",
    icon: "briefcase-search",
  },
  {
    id: "2",
    title: "Company Reviews & Ratings",
    description:
      "Ensures authenticity by verifying company and recruiter credentials.",
    icon: "star-settings",
  },
  {
    id: "3",
    title: "One-Click Apply",
    description: "Save time by applying to jobs with a single tap.",
    icon: "cursor-pointer",
  },
];

// Sample data for recruiters and applications
const recruitersData = [
  { id: "1", name: "Alex", jobApplications: 120, hired: 80 },
  { id: "2", name: "Sarah", jobApplications: 200, hired: 140 },
  { id: "3", name: "Chris", jobApplications: 160, hired: 100 },
];

// Sample data for job applications
const jobApplicationsData = [
  {
    id: "1",
    jobTitle: "Software Developer",
    status: "Open",
    location: "New York",
    applicants: 30,
  },
  {
    id: "2",
    jobTitle: "Data Scientist",
    status: "Closed",
    location: "San Francisco",
    applicants: 25,
  },
  {
    id: "3",
    jobTitle: "UI/UX Designer",
    status: "Open",
    location: "Los Angeles",
    applicants: 10,
  },
];

// Sample data for blogs
const blogsData = [
  {
    id: "1",
    title: "React Native for Beginners",
    description: "Learn the basics of React Native...",
    readTime: "5 mins",
    reads: 1200,
  },
  {
    id: "2",
    title: "Building a Backend with Node.js",
    description: "Step-by-step guide to build backend...",
    readTime: "8 mins",
    reads: 800,
  },
  {
    id: "3",
    title: "Understanding Redux",
    description: "A deep dive into Redux for state management...",
    readTime: "7 mins",
    reads: 1500,
  },
];

const calculateReadingTime = (content) => {
  const wordsPerMinute = 30; // Average reading speed (words per minute)
  const wordCount = content?.split(" ")?.length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
};
const HomePage = () => {
  const navigate = useNavigation();
  const isFocus = useIsFocused();
  const [recruitersDataState, setRecruitersDataState] = useState(recruitersData);
  const [jobApplicationsDataState, setJobApplicationsDataState] = useState([]);
  const [blogsDataState, setBlogsDataState] = useState([]);
  const [companyData, setCompanyData] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [hired, setHired] = useState(0);
  const [recruiterHired, setRecruiterHired] = useState(0);
  const [jobApplicationCount, setJobApplicationCount] = useState([]);

  const notifications = [
    {
      id: "1",
      type: "new_application",
      message: "You received 5 new applications.",
      time: "2h ago",
    },
    {
      id: "2",
      type: "job_expiry",
      message: 'Your job posting "Software Engineer" expires in 2 days.',
      time: "1d ago",
    },
    {
      id: "3",
      type: "interview_reminder",
      message: "Interview scheduled with John Doe tomorrow at 10 AM.",
      time: "1d ago",
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "new_application":
        return <MaterialIcons name="person-add" size={24} color="#4CAF50" />;
      case "job_expiry":
        return <MaterialIcons name="warning" size={24} color="#FF9800" />;
      case "interview_reminder":
        return <MaterialIcons name="event" size={24} color="#3F51B5" />;
      default:
        return <MaterialIcons name="notifications" size={24} color="#000" />;
    }
  };

  const partners = [
    {
      id: 1,
      name: "Google",
      logo: "https://img.freepik.com/free-vector/colorful-minimalist-creative-marketing-agency-logo-template_742173-17286.jpg?t=st=1743033649~exp=1743037249~hmac=01070ad970f9e742b12c4dd19e07d3fc49a9fcddba2c865286e1652ab7eb7647&w=900",
    },
    {
      id: 2,
      name: "Microsoft",
      logo: "https://img.freepik.com/free-vector/illustration-circle-stamp-banner_53876-28483.jpg?t=st=1743033497~exp=1743037097~hmac=b29cd621f7e91176ca5c2231880d487e90dc44929443216f94683fd192a775bb&w=900",
    },
    {
      id: 3,
      name: "Amazon",
      logo: "https://img.freepik.com/free-vector/abstract-logo-flame-shape_1043-44.jpg?t=st=1743033534~exp=1743037134~hmac=3ef02d177501361144c2b4bcb417f4df7dc916389e3d71c6531fb56884692705&w=900",
    },
    {
      id: 4,
      name: "Apple",
      logo: "https://img.freepik.com/premium-vector/black-blue-abstract-keylike-symbol-vector-illustration_95164-403.jpg?w=900",
    },
  ];

  const coFounders = [
    {
      name: "Alice Johnson",
      title: "CEO & Co-Founder",
      image:
        "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?t=st=1743033963~exp=1743037563~hmac=8843cc8fd76eaf4bf395865dc66858afc4c68832c5b99ac71df3ff2fde492bb5&w=1380", // Replace with actual image URL
    },
    {
      name: "Bob Smith",
      title: "CTO & Co-Founder",
      image:
        "https://img.freepik.com/free-photo/cute-smiling-young-man-with-bristle-looking-satisfied_176420-18989.jpg?t=st=1743034021~exp=1743037621~hmac=cf35cc7e4176368c4d2f89860060ec42660dc6cd06544dec259117acd2f52c35&w=1380", // Replace with actual image URL
    },
    {
      name: "Charlie Davis",
      title: "CMO & Co-Founder",
      image:
        "https://img.freepik.com/free-photo/young-adult-enjoying-virtual-date_23-2149328221.jpg?t=st=1743034065~exp=1743037665~hmac=a1462c492a43dabcfe869ccfe498a84e2623689f0500bb5959a8c09ffef72035&w=740", // Replace with actual image URL
    },
  ];
  const recruitmentRate = "500+ New Hires in 2024";

  const milestones = [
    "🚀 Expanded to 10 countries",
    "👥 1M+ users on our platform",
    "🤖 Launched AI-powered hiring tool",
  ];

  const awards = [
    { name: "🏆 Best Startup 2023", year: "2023" },
    { name: "🏅 Innovation Excellence Award", year: "2022" },
  ];

  const news = [
    { title: "💰 Raised $50M in Series B funding", date: "March 2024" },
    { title: "🤝 Partnership with XYZ Corp announced", date: "Jan 2024" },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData();
        setCompanyData(data);

        const recruiterData = await getRecruiter(data?.company_email, null);
        setRecruitersDataState({ dataLength: recruiterData?.length, recruiterData });

        const recruiterJobPostData = await Promise.all(
          recruiterData?.map(async (rec) => {
            const jobPosts = await getJobPost(null, rec?.recruiter_id, null);

            // Fetch applicants for each job post
            const hiredCount = await Promise.all(
              jobPosts.map(async (job) => {
                const applicants = await appliedJob(null, job?.job_post_id);
                return applicants.filter((a) => a?.application_status === "accepted").length;
              })
            );

            // Sum up hired applicants for this recruiter
            const totalHired = hiredCount.reduce((acc, count) => acc + count, 0);

            return { recruiter_id: rec?.recruiter_id, hired_count: totalHired };
          })
        );

        setRecruiterHired(recruiterJobPostData)

        const jobPostData = await getJobPost(data?.company_email, undefined, null);
        setJobApplicationsDataState({ dataLength: jobPostData?.length, jobPostData });

        let jobApplicantCount = [];
        const applicantsList = await Promise.all(
          jobPostData?.map(async (job) => {
            const applicantsForEachJob = await appliedJob(null, job?.job_post_id);
            let temp = { job_post_id: job?.job_post_id, applicant_count: applicantsForEachJob.length }
            jobApplicantCount.push(temp);
            return applicantsForEachJob;
          })
        );
        setJobApplicationCount(jobApplicantCount);

        // Flatten the array and update state
        setApplicants(applicantsList.flat());
        setHired(applicantsList.flat().filter(a => a?.application_status === "accepted")?.length);

        const currentSub = await getSubscriptionMapping(data?.company_id, "0");
        if (currentSub.length) {
          const subDet = await getSubscription(null, null, currentSub[0]?.subscription_id);
          console.log("Subscription Details: ", currentSub);
          if (currentSub?.[0]?.subscription_id === "10") {
            setCurrentSubscription({ subscription_name: "Custom Plan" });
          } else {
            setCurrentSubscription({ ...currentSub?.[0], ...subDet?.[0] });
          }
        } else {
          setCurrentSubscription(null)
        }

        const blogData = await getBlog(null, null, 3);
        setBlogsDataState(blogData);

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

  // Render function for Job Application Card
  const renderJobApplicationItem = ({ item }) => (
    <View style={styles.jobCard}>
      <Icon name="briefcase" size={24} color="#5B5B5B" />
      <CText fontWeight={600} sx={styles.jobTitle}>
        {item.job_post_name}
      </CText>
      <CText>
        Status:{" "}
        <CText sx={styles.jobStatus}>
          {item.is_deleted === "False" ? "Open" : "Closed"}
        </CText>
      </CText>
      <CText>
        <Icon name="map-marker" size={16} color="#5B5B5B" />{" "}
        {item.job_post_location}
      </CText>
      <CText>Applicants: {jobApplicationCount?.filter((d) => d?.job_post_id === item?.job_post_id)?.[0]?.applicant_count || 0}</CText>
      <TouchableOpacity
        onPress={() =>
          navigate.navigate("Applications", {
            screen: "ApplicationDetail",
            params: { applicationId: item.job_post_id },
          })
        }
      >
        <CText sx={styles.viewDetailsButton}>View Details</CText>
      </TouchableOpacity>
    </View>
  );

  // Render function for Blog Card
  const renderBlogItem = ({ item }) => {
    const truncatedDescription =
      item.blog_description?.length > 50
        ? item.blog_description.slice(0, 50) + "..."
        : item.blog_description;

    return (
      <View style={styles.blogCard}>
        <View style={styles.blogImage}>
          <Image
            source={{ uri: item.blog_image }}
            style={{ borderRadius: 8 }}
            height={100}
          />
        </View>
        <CText fontWeight={600} sx={styles.blogTitle}>
          {item.blog_title}
        </CText>
        <CText sx={styles.blogDescription}>{truncatedDescription}</CText>
        <View style={styles.readTimeContainer}>
          <Icon name="clock" size={18} color="#000" />
          <CText sx={styles.readTime}>
            Time to read: {calculateReadingTime(item.blog_description)}
          </CText>
        </View>
        <View style={styles.readsContainer}>
          <Icon name="eye" size={18} color="#000" />
          <CText sx={styles.reads}>Reads: {item.reads}</CText>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigate.navigate("Blog Detail", { blogId: item.blog_id })
          }
        >
          <CText sx={styles.readMoreButton}>Read More</CText>
        </TouchableOpacity>
      </View>
    );
  };

  // Render function for Recruiter Card
  const renderRecruiterItem = ({ item }) => (
    <View style={styles.recruiterCard}>
      <Icon name="account" size={24} color="#5B5B5B" />
      <CText fontWeight={600} fontSize={18}>
        {item.recruiter_name}
      </CText>
      {/* <CText>Applications Created: {item.jobApplications}</CText> */}
      <CText>Hired: {recruiterHired?.filter(recHi => recHi?.recruiter_id === item?.recruiter_id)?.[0]?.hired_count}</CText>
      <TouchableOpacity
        onPress={() =>
          navigate.navigate("Recruiters", {
            screen: "RecruiterDetail",
            params: { recruiterId: item.recruiter_id },
          })
        }
      >
        <CText sx={styles.viewDetailsButton}>View Details</CText>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={notifications} // Notification list shown as main FlatList data
      keyExtractor={(item) => item.id}
      style={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.notificationCard}>
          {getIcon(item.type)}
          <View style={styles.textContainer}>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </TouchableOpacity>
      )}
      ListHeaderComponent={
        <>
          {/* Subscription Section */}
          <View style={styles.subscriptionSection}>
            <CText sx={styles.subscriptionTitle} fontWeight={600}>
              Current Subscription: {currentSubscription?.subscription_name || "Free Plan"}
            </CText>
            <Icon name="star" size={30} color="#FFD700" />
          </View>

          {/* Stats Cards */}
          <View style={styles.gridContainer}>
            <CStatisticsCard label="Recruiters" value={recruitersDataState?.dataLength || 0} iconName="home" />
            <CStatisticsCard label="Job Posts" value={jobApplicationsDataState?.dataLength || 0} iconName="home" />
            <CStatisticsCard label="Application" value={applicants?.length || 0} iconName="home" />
            <CStatisticsCard label="Hired" value={hired} iconName="home" />
          </View>

          {/* Recruiters */}
          <View style={styles.sectionHeader}>
            <CText fontWeight={600} fontSize={22}>Recruiters</CText>
            <TouchableOpacity onPress={() => navigate.navigate("Recruiters", { screen: "MyRecruiter" })}>
              <CText sx={styles.moreButton}>More</CText>
            </TouchableOpacity>
          </View>

          {recruitersDataState?.recruiterData?.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <CText style={styles.noResultsText}>No Recruiters Added</CText>
            </View>
          ) : (
            <FlatList
              data={recruitersDataState?.recruiterData?.slice(0, 3)}
              renderItem={renderRecruiterItem}
              keyExtractor={(item) => item?.recruiter_id}
              horizontal
              snapToInterval={width * 0.75}
              decelerationRate="fast"
              snapToAlignment="center"
              pagingEnabled
            />
          )}

          {/* Notifications Header */}
          <View style={styles.sectionHeader}>
            <CText fontWeight={600} fontSize={22}>Notifications</CText>
          </View>
        </>
      }
      ListFooterComponent={
        <>
          {/* Job Posts */}
          <View style={styles.sectionHeader}>
            <CText fontWeight={600} fontSize={22}>Job Posts</CText>
            <TouchableOpacity onPress={() => navigate.navigate("Applications", { screen: "MyJobApplication" })}>
              <CText sx={styles.moreButton}>More</CText>
            </TouchableOpacity>
          </View>
          <View>
            {/* Recruitment Rate */}
            {/* <View style={styles.section}>
          <MaterialIcons name="group" size={24} color="#007bff" />
          <Text style={styles.sectionTitle}>Recruitment Rate</Text>
        </View>
        <Text style={styles.text}>{recruitmentRate}</Text> */}
            {/* Milestones */}
            {/* <View style={styles.section}>
          <FontAwesome name="flag-checkered" size={24} color="#28a745" />
          <Text style={styles.sectionTitle}>Milestones</Text>
        </View>
        <FlatList
          data={milestones}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.listItem}>{item}</Text>}
        /> */}
            {/* Awards
        <View style={styles.section}>
          <FontAwesome name="trophy" size={24} color="#ff9800" />
          <Text style={styles.sectionTitle}>Awards</Text>
        </View>
        <FlatList
          data={awards}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.listItem}>
              {item.name} - {item.year}
            </Text>
          )}
        /> */}
            {/* News */}
            {/* <View style={styles.section}>
          <MaterialIcons name="article" size={24} color="#e91e63" />
          <Text style={styles.sectionTitle}>Recent News</Text>
        </View>
        <FlatList
          data={news}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.listItem}>
              {item.title} ({item.date})
            </Text>
          )}
        /> */}
          </View>
          {/* <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Know our Co-Founders</Text>
      </View> */}
          {/* First Row (Two Co-Founders) */}
          {/* <View style={styles.row}>
        {coFounders.slice(0, 2).map((founder, index) => (
          <View key={index} style={styles.card}>
            <Image source={{ uri: founder.image }} style={styles.image} />
            <Text style={styles.name}>{founder.name}</Text>
            <Text style={styles.title}>{founder.title}</Text>
          </View>
        ))}
      </View> */}
          {/* Second Row (One Co-Founder) */}
          {/* <View style={styles.centeredRow}>
        <View style={styles.card}>
          <Image source={{ uri: coFounders[2].image }} style={styles.image} />
          <Text style={styles.name}>{coFounders[2].name}</Text>
          <Text style={styles.title}>{coFounders[2].title}</Text>
        </View>
      </View> */}
          {/* our Partners */}
          {/* <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Our Partners</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.logoContainer}
      >
        {partners.map((partner) => (
          <Image
            key={partner.id}
            source={{ uri: partner.logo }}
            style={[styles.logo, { resizeMode: "contain" }]}
          />
        ))}
      </ScrollView> */}
          {jobApplicationsDataState?.jobPostData?.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <CText style={styles.noResultsText}>No Job Post Present</CText>
            </View>
          ) : (
            <FlatList
              data={jobApplicationsDataState?.jobPostData?.slice(0, 3)}
              renderItem={renderJobApplicationItem}
              keyExtractor={(item) => item?.job_post_id}
              horizontal
              snapToInterval={width * 0.75}
              decelerationRate="fast"
              snapToAlignment="center"
              pagingEnabled
            />
          )}

          {/* Features Section */}
          <View style={styles.sectionHeader}>
            <CText fontWeight={600} fontSize={22}>Features</CText>
          </View>
          <FlatList
            data={features}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false} // prevent inner scroll conflict
            renderItem={({ item }) => (
              <View style={styles.featureCard}>
                <Icon name={item.icon} size={30} color="#000" />
                <Text style={styles.title}>{item.title}</Text>
              </View>
            )}
          />

          {/* Blogs */}
          <View style={styles.sectionHeader}>
            <CText fontWeight={600} fontSize={22}>Latest Blogs</CText>
            <TouchableOpacity onPress={() => navigate.navigate("Blog List")}>
              <Text style={styles.moreButton}>More</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={blogsDataState}
            renderItem={renderBlogItem}
            keyExtractor={(item) => item.blog_id}
            horizontal
            snapToInterval={width * 0.75}
            decelerationRate="fast"
            snapToAlignment="center"
            pagingEnabled
          />

          {/* Footer margin */}
          <View style={{ marginBottom: 120 }} />
        </>
      }
    />

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "rgba(255, 251, 251, 0.5)", // Semi-transparent black overlay
    padding: 16,
  },
  gridContainer: {
    height: 250,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 10, // Space between cards
    // padding: 10,
  },
  subscriptionSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  subscriptionTitle: {
    color: "#053766",
    fontSize: 20,
    // fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 22,
    color: "#053766",
    fontWeight: "600",
  },
  moreButton: {
    color: "#007bff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  jobCard: {
    borderRadius: 10,
    margin: 8,
    width: width * 0.7,
    shadowColor: "#000",
    shadowOpacity: 0.05, // Reduced shadow visibility
    shadowRadius: 3,
    elevation: 2, // Light shadow on Android'

    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  jobTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  jobStatus: {
    color: "green",
  },
  viewDetailsButton: {
    marginTop: 10,
    color: "#0d0ddb",
  },
  blogCard: {
    borderRadius: 10,
    margin: 8,
    width: width * 0.7,
    shadowColor: "#000",
    shadowOpacity: 0.05, // Reduced shadow visibility
    shadowRadius: 3,
    elevation: 2, // Light shadow on Android'

    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  blogImage: {
    height: 100,
    backgroundColor: "#ddd",
    marginBottom: 10,
    borderRadius: 8,
  },
  blogTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  blogDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  readTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  readTime: {
    fontSize: 12,
    color: "#777",
    marginLeft: 6,
  },
  readsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reads: {
    fontSize: 12,
    color: "#777",
    marginLeft: 6,
  },
  readMoreButton: {
    color: "#007bff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  recruiterCard: {
    borderRadius: 10,
    margin: 8,
    width: width * 0.7,
    shadowColor: "#000",
    shadowOpacity: 0.05, // Reduced shadow visibility
    shadowRadius: 3,
    elevation: 2, // Light shadow on Android'

    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20, // Space between logos
  },
  logo: {
    width: 100,
    height: 100,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  centeredRow: {
    alignItems: "center",
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 40, // Makes it round
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  title: {
    fontSize: 12,
    color: "gray",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#222",
  },
  text: {
    fontSize: 16,
    color: "#b0b0b0",
    marginBottom: 10,
    marginLeft: 35,
  },
  listItem: {
    fontSize: 16,
    color: "#6e6b6b.",
    marginLeft: 35,
    marginBottom: 5,
  },
  highlightSection: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "320",
    padding: 12,
    borderRadius: 6,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05, // Reduced shadow visibility
    shadowRadius: 3,
    elevation: 2,
  },
  textContainer: {
    marginLeft: 10,
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
  },
  time: {
    fontSize: 12,
    color: "gray",
  },
  featureCard: {
    alignItems: "center",
    padding: 10,
    margin: 5,
    flex: 1,
  },
  icon: {
    width: 50,
    height: 50,
    // marginBottom: 15,
  },
  title: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  description: {
    fontSize: 12,
    textAlign: "center",
    color: "#555",
  },
});

export default HomePage;
