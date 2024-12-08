import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import Home from './Home';
import MyRecruiter from './MyRecruiter';
import MyJobApplication from './MyJobApplication';
import Subscription from './Subscription';
import { createStackNavigator } from '@react-navigation/stack';
import RecruiterDetail from './RecruiterDetail';
import { StyleSheet, View, Text } from 'react-native';
import ApplicationDetail from './JobDescription';
import ApplicantDetails from './ApplicationDetail';
import CustomHeader from './Header';
import BlogPage from './BlogDetail';
import CompanyProfilePage from './Profile';
import CreateBlogScreen from './CreateBlog';
import BlogListScreen from './BlogList';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

function ApplicationsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MyJobApplication"
                component={MyJobApplication}
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="Job Application List" />,
                }}
            />
            <Stack.Screen
                name="ApplicationDetail"
                component={ApplicationDetail}
                // options={{ headerShown: false }} // TODO: Customize the header for each tab
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="My Job Applications" />,
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
                component={Home}
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="Home" />,
                }}
            />
            <Stack.Screen
                name="Create Blog"
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
                name="Profile"
                component={CompanyProfilePage}
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="Profile" />,
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
        </Stack.Navigator>
    );
}

function RecruitersStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MyRecruiter"
                component={MyRecruiter}
                // options={{ headerShown: false }} 
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="Recruiters List" />,
                }}
            />
            <Stack.Screen
                name="RecruiterDetail"
                component={RecruiterDetail}
                // options={{ headerShown: false }} // TODO: Customize the header for each tab
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="My Job Applications" />,
                }}
            />
            <Stack.Screen
                name="ApplicantDetail"
                component={ApplicantDetails}
                // options={{ headerShown: false }} // TODO: Customize the header for each tab
                options={{
                    headerShown: true,
                    header: () => <CustomHeader title="Applicant Detail" />,
                }}
            />
        </Stack.Navigator>
    );
}

export default function BottomNavigationApp() {
    return (
        <Tab.Navigator
            screenOptions={() => ({
                tabBarStyle: styles.tabBarStyle,
                tabBarItemStyle: styles.tabBarItemStyle,
                tabBarActiveBackgroundColor: "#ffffff",
                tabBarActiveTintColor: "#000000",
                tabBarInactiveTintColor: "#ffffff",
            })}>
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
                name="Recruiters"
                component={RecruitersStack}
                // component={Recruiter}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontistoIcon name="person" color={color} size={size} />
                    ),
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="Applications"
                // component={Application}  // Use the stack navigator here
                component={ApplicationsStack}  // Use the stack navigator here
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
                    //   headerShown: false,
                    header: () => <CustomHeader title="Subscription" />,
                }}
            />
        </Tab.Navigator>
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
    tabBarItemStyle: {
        paddingVertical: 10,
        margin: 10,
        borderRadius: 40
    },
})
