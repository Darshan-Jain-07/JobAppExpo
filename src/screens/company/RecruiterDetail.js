import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import CText from '../../components/CText';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import CStatisticsCard from '../../components/CStatisticsCard';
import CIconStatisticsCard from '../../components/CIconStatisticsCard';
import CJobPostCard from '../../components/CJobPostCard';
import { useNavigation } from '@react-navigation/native';
import { getRecruiter } from '../../services/RecruiterService';
import { getJobPost } from '../../services/JobPostService';
import dayjs from 'dayjs';
import { ActivityIndicator } from 'react-native-paper';

const { width } = Dimensions.get('window');

const RecruiterDetailPage = ({ route }) => {
    const navigation = useNavigation();
    const { recruiterId } = route.params;
    console.log(recruiterId)
    const [recruiter, setRecruiter] = useState({})
    const [recruiterJobPosts, setRecruiterJobPosts] = useState([])
    const [isDataLoaded, setIsDataLoaded] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            let recruiterData = await getRecruiter(null, null, recruiterId);
            setRecruiter(recruiterData[0])

            let recruiterJobPostData = await getJobPost(null, recruiterId);
            setRecruiterJobPosts(recruiterJobPostData)
            
            setIsDataLoaded(true)
        }

        fetchData();
    }, [recruiterId])

    if (!isDataLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
                <ActivityIndicator animating={true} color={"#000"} size={"large"} />
            </View>
        )
    }

    // Combine recruiter details and job posts into one data array for the FlatList
    const data = [
        { type: 'recruiter', content: recruiter },
        { type: 'recruiterStats', content: [
            {
                label: "Job Post",
                value: "55",
                icons: "briefcase"
            },
            {
                label: "Hired",
                value: "11000",
                icons: "user-plus"
            },
        ], },  // Moved stats to come after recruiter
        { type: 'jobPost', content: recruiter.jobPosts },  // Moved job posts to come last
    ];

    function truncateDecs(description) {
        const maxLength = 70;
        const truncatedDescription = description.length > maxLength
            ? description.substring(0, maxLength) + '...'
            : description;

        return truncatedDescription;
    }

    const renderItem = ({ item }) => {
        console.log(item.type); // Debugging to see the order being rendered
        console.log("item.type"); // Debugging to see the order being rendered

        if (item.type === 'recruiter') {
            console.log(recruiter.recruiter_image)
            console.log("recruiter.recruiter_image")
            // Render recruiter details
            return (
                <View style={styles.headerContainer}>
                    <Image source={{ uri: recruiter.recruiter_image }} style={styles.recruiterImage} />
                    <View style={styles.recruiterDetails}>
                        { recruiter?.recruiter_name && <CText style={styles.recruiterName} fontSize={23} fontWeight={700}>{recruiter?.recruiter_name}</CText> }
                        { recruiter?.recruiter_description && <CText style={styles.recruiterDescription} fontSize={16}>{recruiter?.recruiter_description}</CText> }
                    </View>
                </View>
            );
        }
        else if (item.type === 'recruiterStats') {
            // Render recruiter stats
            return (
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}>
                    {item?.content?.map((d, index) => {
                        return <CIconStatisticsCard key={index} label={d?.label} value={d?.value} iconName={d?.icons} />
                    })}
                </View>
            );
        } else if (item.type === 'jobPost') {
            // Render job posts
            const handleViewJobDetail = (applicationId) => {
                navigation.navigate('Applications', { screen: 'ApplicationDetail', params: { applicationId } });
            }
            return (
                <View style={styles.jobPostsContainer}>
                    <CText style={styles.sectionTitle} fontSize={20} fontWeight={700}>Job Posts</CText>
                    <FlatList
                        style={{ marginTop: 20 }}
                        data={recruiterJobPosts}
                        keyExtractor={job => job.job_post_id}
                        renderItem={({ item }) => (
                            <>
                            {recruiterJobPosts.length > 0 && <CJobPostCard onPress={() => { handleViewJobDetail(item.job_post_id) }} date={dayjs(item?.created_at).format("DD-MM-YYYY")} hires={"5"} description={truncateDecs(item?.job_post_description)} location={item?.job_post_location} title={item?.job_post_name} />}
                            </>
                        )}
                    />
                </View>
            );
        }
    };

    return (
        <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    headerContainer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    recruiterImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 20,
    },
    recruiterDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    recruiterName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    recruiterDescription: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
    },
    jobPostsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 90,
        paddingTop: 10
    },
    sectionTitle: {
        fontSize: 22,
        color: '#333',
        marginBottom: 12,
    }
});

export default RecruiterDetailPage;
