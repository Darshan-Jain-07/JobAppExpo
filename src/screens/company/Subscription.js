import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import CText from '../../components/CText';
import { useNavigation } from '@react-navigation/native';
import MyRecruiter from './MyRecruiter';
// import Carousel from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import CSubscriptionCard from '../../components/CSubscriptionCard';
// import { ScrollView } from 'react-native-gesture-handler';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const Subscription = () => {
  const navigation = useNavigation();
  function handleRecruiter() {
    navigation.navigate('Bottom Navigation App', { screen: "Recruiters" });
  }
  function handleApplication() {
    navigation.navigate('Bottom Navigation App', { screen: "Applications" });
  }
  const subscriptionData = [
    {
      name: 'Premium Plan',
      price: '₹9.99',
      timeSpan: "/month",
      description: [
        'Access to all premium features',
        'Ad-free experience',
        'Priority customer support',
      ],
    },
    {
      name: 'Basic Plan',
      price: '₹4.99',
      timeSpan: "/month",
      description: [
        'Access to basic features',
        'Limited ads',
        'Standard customer support',
      ],
    },
    {
      name: 'Ultimate Plan',
      price: '₹19.99',
      timeSpan: "/month",
      description: [
        'Unlimited access to all features',
        'Ad-free experience',
        '24/7 customer support',
      ],
    },
    // Add more plans here
  ];
  return (
    <ScrollView
      style={styles.container}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      snapToInterval={width * 0.85 + 15}  // Width of the card + margin
      snapToAlignment="center"  // Ensures the card snaps to the center of the screen
      decelerationRate="fast"  // Makes the scroll stop more abruptly after you swipe
      contentInsetAdjustmentBehavior="automatic" // Ensures the card is properly aligned when snapping
    >
      {subscriptionData.map((subscription, index) => (
        <CSubscriptionCard key={index} name={subscription.name} price={subscription.price} timeSpan={subscription.timeSpan} description={subscription.description} buttonText={"Subscribe"} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
});

export default Subscription;