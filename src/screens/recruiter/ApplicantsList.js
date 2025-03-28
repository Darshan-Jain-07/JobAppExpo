import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, StyleSheet, FlatList } from "react-native";
import { List } from "react-native-paper"; // Import Accordion component
import { getApplication } from "../../services/ApplicationService";
import CApplicantItem from "../../components/CApplicantList";

const ApplicantsList = ({ route }) => {
  const { applicationId } = route.params;
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({}); // State to track open sections

  const [applicants, setApplicants] = useState([]);
  const [pendingApplicants, setPendingApplicants] = useState([]);
  const [rejectedApplicants, setRejectedApplicants] = useState([]);
  const [acceptedApplicants, setAcceptedApplicants] = useState([]);
  const [refreshKey, setRefreshKey] = useState(true)

  const refresh = () => {
    setRefreshKey((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const applicantsData = await getApplication(null, applicationId, null);
        setApplicants(applicantsData);

        setPendingApplicants(applicantsData.filter(app => app.application_status === "pending" || app.application_status === "in_review"));
        setRejectedApplicants(applicantsData.filter(app => app.application_status === "rejected"));
        setAcceptedApplicants(applicantsData.filter(app => app.application_status === "accepted"));

        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchData();
  }, [applicationId, refreshKey]);

  if (!isDataLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator animating={true} color={"#000"} size={"large"} />
      </View>
    );
  }

  // Function to toggle accordion sections
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        {/* All Applicants Section */}
        {/* <List.Accordion
          title={`All Applicants (${applicants.length})`}
          expanded={expandedSections.all}
          onPress={() => toggleSection("all")}
        >
          <FlatList
            data={applicants}
            renderItem={({ item }) => <CApplicantItem item={item} func={refresh}  />}
            keyExtractor={(item) => item.applicant_id.toString()}
            scrollEnabled={false} // Prevents nested scrolling issues
          />
        </List.Accordion> */}

        {/* Pending Applicants Section */}
        <List.Accordion
          title={`Pending Applicants (${pendingApplicants.length})`}
          expanded={expandedSections.pending}
          onPress={() => toggleSection("pending")}
        >
          <FlatList
            data={pendingApplicants}
            renderItem={({ item }) => <CApplicantItem item={item} func={refresh} />}
            keyExtractor={(item) => item.applicant_id.toString()}
            scrollEnabled={false}
          />
        </List.Accordion>

        {/* Accepted Applicants Section */}
        <List.Accordion
          title={`Accepted Applicants (${acceptedApplicants.length})`}
          expanded={expandedSections.accepted}
          onPress={() => toggleSection("accepted")}
        >
          <FlatList
            data={acceptedApplicants}
            renderItem={({ item }) => <CApplicantItem item={item} func={refresh} />}
            keyExtractor={(item) => item.applicant_id.toString()}
            scrollEnabled={false}
          />
        </List.Accordion>

        {/* Rejected Applicants Section */}
        <List.Accordion
          title={`Rejected Applicants (${rejectedApplicants.length})`}
          expanded={expandedSections.rejected}
          onPress={() => toggleSection("rejected")}
        >
          <FlatList
            data={rejectedApplicants}
            renderItem={({ item }) => <CApplicantItem item={item} func={refresh} />}
            keyExtractor={(item) => item.applicant_id.toString()}
            scrollEnabled={false}
          />
        </List.Accordion>
      </List.Section>
      <View style={{ paddingVertical: 30 }}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ApplicantsList;