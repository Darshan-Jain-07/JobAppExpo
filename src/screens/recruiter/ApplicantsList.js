import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getApplication } from '../../services/ApplicationService';
import CApplicantItem from '../../components/CApplicantList';

const ApplicantsList = ({ route }) => {
  const { applicationId } = route.params;
  const [noOfApplicants, setNoOfApplicants] = useState(0);
  const [applicants, setApplicants] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const applicants = await getApplication(null, applicationId, null);
      setNoOfApplicants(applicants.length || 0);
      setApplicants(applicants);
      setIsDataLoaded(true);
    };

    fetchData();
  }, [applicationId]);

  if (!isDataLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
        <ActivityIndicator animating={true} color={"#000"} size={"large"} />
      </View>
    );
  }

  return (
    <FlatList
      data={applicants}
      renderItem={({ item }) => <CApplicantItem item={item} />}
      keyExtractor={item => item.applicant_id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
});

export default ApplicantsList;