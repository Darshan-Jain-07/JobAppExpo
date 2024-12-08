import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './screens/Splash';
import GetStarted from './screens/GetStarted';
import Login from './screens/Login';
import Signup from './screens/SignUp';
import BottomNavigationApp from './screens/company/BottomNavigation';
import RecruiterDetail from './screens/company/RecruiterDetail';
import HomePage from './screens/company/Home';
import Profile from './screens/company/Profile';
import BlogPage from './screens/company/BlogDetail';
import CreateBlogScreen from './screens/company/CreateBlog';
import PaymentHistoryScreen from './screens/company/PaymentHistory';
import CustomHeader from './screens/company/Header';
import BlogListScreen from './screens/company/BlogList';
import SignUpCompany from './screens/company/SignUpCompany';
import UploadImageScreen from './screens/company/Img';
import SignUpRecruiter from './screens/recruiter/SignUpRecruiter';
import SignUpJobSeeker from './screens/jobSeeker/SignUpJobseeker';
import ViewCompanyDetail from './screens/company/ViewCompanyDetail';
import BottomNavigationJobSeeker from './screens/jobSeeker/BottomNavigationJobSeeker';
import BottomNavigationRecruiter from './screens/recruiter/BottomNavigationRecruiter';
import ViewRecruiterDetail from './screens/recruiter/ViewRecruiterDetail';
import ViewApplicantDetail from './screens/jobSeeker/ViewApplicantDetail';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen options={{headerShown: false}} name="Splash" component={Splash} />
                <Stack.Screen options={{headerShown: false}} name="Get Started" component={GetStarted} />
                <Stack.Screen options={{headerShown: false}} name="Log In" component={Login} />
                <Stack.Screen options={{headerShown: false}} name="Sign Up" component={Signup} />
                <Stack.Screen options={{headerShown: false}} name="Sign Up Company" component={SignUpCompany} />
                <Stack.Screen options={{headerShown: false}} name="Sign Up Recruiter" component={SignUpRecruiter} />
                <Stack.Screen options={{headerShown: false}} name="Sign Up Applicant" component={SignUpJobSeeker} />
                <Stack.Screen options={{headerShown: false}} name="Bottom Navigation App" component={BottomNavigationApp} />
                <Stack.Screen options={{headerShown: false}} name="Bottom Navigation Applicant" component={BottomNavigationJobSeeker} />
                <Stack.Screen options={{headerShown: false}} name="Bottom Navigation Recruiter" component={BottomNavigationRecruiter} />
                <Stack.Screen options={{headerShown: false}} name="Recruiter Detail" component={RecruiterDetail} />
                <Stack.Screen options={{headerShown: false}} name="Home" component={HomePage} />
                <Stack.Screen options={{headerShown: false}} name="Create Blog" component={CreateBlogScreen} />
                <Stack.Screen options={{headerShown: false}} name="Profile" component={Profile} />
                <Stack.Screen options={{headerShown: false}} name="View Company Detail" component={ViewCompanyDetail} />
                <Stack.Screen options={{headerShown: false}} name="View Recruiter Detail" component={ViewRecruiterDetail} />
                <Stack.Screen options={{headerShown: false}} name="View Applicant Detail" component={ViewApplicantDetail} />
                <Stack.Screen options={{headerShown: true, header: ()=><CustomHeader title={"Payment History"} />}} name="Payment History" component={PaymentHistoryScreen} />
                <Stack.Screen options={{headerShown: false}} name="Blog Detail" component={BlogPage} />
                <Stack.Screen options={{headerShown: false}} name="Blog List" component={BlogListScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;