import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
// import Home from './Home';
// import MyRecruiter from './MyRecruiter';
// import MyJobApplication from './MyJobApplication';
// import Subscription from './Subscription';
import { createStackNavigator } from '@react-navigation/stack';
// import RecruiterDetail from './RecruiterDetail';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import CustomHeader from './CustomHeaderApplicant';
import ProfilePage from './Profile';
import CreateBlogScreen from '../company/CreateBlog';
import BlogListScreen from '../company/BlogList';
import BlogPage from '../company/BlogDetail';
import HomePage from './Home';
import Subscription from './Subscription';
import CompanyProfileScreen from './CompanyProfile';
import ChatScreen from './ChatScreen';
import ChatList from '../chat/ChatList';
import JobDescription from './JobPostDetail';
import JobPostList from './JobPostList';
import CompaniesList from './CompaniesList';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import PaymentHistoryScreen from './PaymentHistory';
// import JobDescription from '../company/JobDescription';
// import ApplicationDetail from './JobDescription';
// import ApplicantDetails from './ApplicationDetail';
// import CustomHeader from './Header';
// import BlogPage from './BlogDetail';
// import CompanyProfilePage from './Profile';
// import CreateBlogScreen from './CreateBlog';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

const MyJobApplication = () => {
    return <View><Text>Job Application</Text></View>
}

const MyRecruiter = () => {
    return <View><Text>MyRecruiter</Text></View>
}

function ApplicationsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Companies List"
                component={CompaniesList}
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="Companies" />,
                }}
            />
        </Stack.Navigator>
    );
}

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home Page"
                component={HomePage}
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="Home" chat={true} />,
                }}
            />
            <Stack.Screen
                name="Payment History"
                component={PaymentHistoryScreen}
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="Payment Hostory" chat={true} />,
                }}
            />
            <Stack.Screen
                name="Create Blog Applicant"
                component={CreateBlogScreen}
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="Write a Blog" />,
                }}
            />
            <Stack.Screen
                name="Blog List"
                component={BlogListScreen}
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="Blogs" />,
                }}
            />
            <Stack.Screen
                name="Blog Detail"
                component={BlogPage}
                // options={{ headerShown: false }} // TODO: Customize the header for each tab
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="Blog" />,
                }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfilePage}
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="Profile" />,
                }}
            />
            <Stack.Screen
                name="Company Profile"
                component={CompanyProfileScreen}
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="Company Profile" />,
                }}
            />
            <Stack.Screen
                name="ChatList"
                component={ChatList}
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="Chat" />,
                }}
            />
            <Stack.Screen
                name="ApplicationDetail"
                component={JobDescription}
                // options={{ headerShown: false }} // TODO: Customize the header for each tab
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="Job Post Details" />,
                }}
            />
        </Stack.Navigator>
    );
}

function RecruitersStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Job Post List"
                component={JobPostList}
                // options={{ headerShown: false }} 
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="Jobs" />,
                }}
            />
        </Stack.Navigator>
    );
}

export default function BottomNavigationJobSeeker() {
    const navigation = useNavigation();
    const openChatbot = () => {
        navigation.navigate("ChatBot");
        // Here you would open the chatbot (e.g., navigate to a new screen or show a modal)
    };
    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: "#fff",
                    tabBarInactiveTintColor: "gray",
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "#000",
                        height: "8%",
                    },
                    tabBarIconStyle: {
                        marginTop: 10,
                    }
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeStack}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <FontistoIcon name="home" color={color} size={size} />
                        ),
                        headerShown: false
                    }}
                />
                <Tab.Screen
                    name="Jobs"
                    component={RecruitersStack}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <FontistoIcon name="person" color={color} size={size} />
                        ),
                        headerShown: false
                    }}
                />
                <Tab.Screen
                    name="Companies"
                    component={ApplicationsStack}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <FoundationIcon name="page-edit" color={color} size={size} />
                        ),
                        headerShown: false
                    }}
                />
                <Tab.Screen
                    name="Subscription"
                    component={Subscription}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesomeIcon name="rupee" color={color} size={size} />
                        ),
                        headerShown: true,
                        header: () => <CustomHeader title="Subscription" />,
                    }}
                />
            </Tab.Navigator>
            <FAB
                style={styles.fab}
                icon="robot" // You can use any icon from MaterialCommunityIcons or custom
                onPress={openChatbot}
                color="white"
                backgroundColor="#222222" // Customize the FAB color
            />
        </View>
    );
}

const styles = StyleSheet.create({
    tabBarStyle: {
        height: 80,
        backgroundColor: "#000000",
        position: "absolute",
        bottom: 10,
        left: 20,
        right: 20,
        borderRadius: 40,
        borderTopWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 70,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6200ee',
        borderRadius: 30, // Make it circular if needed
    },
    tabBarItemStyle: {
        paddingVertical: 10,
        margin: 10,
        borderRadius: 40
    },
})
