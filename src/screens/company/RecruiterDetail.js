import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import CText from '../../components/CText';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import CStatisticsCard from '../../components/CStatisticsCard';
import CIconStatisticsCard from '../../components/CIconStatisticsCard';
import CJobPostCard from '../../components/CJobPostCard';
import { useNavigation } from '@react-navigation/native';

const recruiter = {
    name: "John Doe",
    description: "Experienced recruiter specializing in technology and software development roles. ",
    imageUrl: "https://images.pexels.com/photos/3707987/pexels-photo-3707987.jpeg?cs=srgb&dl=pexels-emrekeshavarz-3707987.jpg&fm=jpg",
    recruiterStats: [
        {
            label: "Job Application",
            value: "55",
            icons: "briefcase"
        },
        {
            label: "Hired",
            value: "11000",
            icons: "user-plus"
        },
    ],
    jobPosts: [
        {
            id: '1',
            title: "Software Engineer",
            location: "Surat, GJ",
            description: "Looking for a skilled software engineer.",
            date: "2024-09-01",
            hires: 5, // Number of hires
        },
        {
            id: '2',
            title: "UI/UX Designer",
            location: "Mumbai, MH",
            description: "Hiring a creative UI/UX designer for our team.",
            date: "2024-08-15",
            hires: 3,
        },
        {
            id: '3',
            title: "Software Engineer",
            location: "Surat, GJ",
            description: "Looking for a skilled software engineer.",
            date: "2024-09-01",
            hires: 5, // Number of hires
        },
        {
            id: '4',
            title: "UI/UX Designer",
            location: "Mumbai, MH",
            description: "Hiring a creative UI/UX designer for our team.",
            date: "2024-08-15",
            hires: 3,
        },
        {
            id: '5',
            title: "Product Manager",
            location: "Udaipur, RJ",
            description: "Experienced product manager for an exciting tech company.",
            date: "2024-07-20",
            hires: 2,
        },
    ],
};

const { width } = Dimensions.get('window');

const RecruiterDetailPage = () => {
    const navigation = useNavigation();
    const handleViewJobDetail = () => {
        navigation.navigate('Applications', { screen: 'ApplicationDetail' });
    }


    // Combine recruiter details and job posts into one data array for the FlatList
    const data = [
        { type: 'recruiter', content: recruiter },
        { type: 'recruiterStats', content: recruiter.recruiterStats },  // Moved stats to come after recruiter
        { type: 'jobPost', content: recruiter.jobPosts },  // Moved job posts to come last
    ];

    const renderItem = ({ item }) => {
        console.log(item.type); // Debugging to see the order being rendered

        if (item.type === 'recruiter') {
            // Render recruiter details
            return (
                <View style={styles.headerContainer}>
                    <Image source={{ uri: item.content.imageUrl }} style={styles.recruiterImage} />
                    <View style={styles.recruiterDetails}>
                        <CText style={styles.recruiterName} fontSize={23} fontWeight={700}>{item.content.name}</CText>
                        <CText style={styles.recruiterDescription} fontSize={16}>{item.content.description}</CText>
                    </View>
                </View>
            );
        }
        else if (item.type === 'recruiterStats') {
            // Render recruiter stats
            return (
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent:"space-around" }}>
                    {item.content.map((d, index) => {
                        return <CIconStatisticsCard key={index} label={d.label} value={d.value} iconName={d.icons} />
                    })}
                </View>
            );
        } else if (item.type === 'jobPost') {
            // Render job posts
            return (
                <View style={styles.jobPostsContainer}>
                    <CText style={styles.sectionTitle} fontSize={20} fontWeight={700}>Job Posts</CText>
                    <FlatList
                        style={{ marginTop: 20 }}
                        data={item.content}
                        keyExtractor={job => job.id}
                        renderItem={({ item }) => (
                            <CJobPostCard onPress={handleViewJobDetail} date={item.date} hires={item.hires} description={item.description} location={item.location} title={item.title} />
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
        paddingBottom:90,
        paddingTop:10
    },
    sectionTitle: {
        fontSize: 22,
        color: '#333',
        marginBottom: 12,
    }
});

export default RecruiterDetailPage;
