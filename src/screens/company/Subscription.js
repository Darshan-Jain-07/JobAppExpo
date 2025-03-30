import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import CText from '../../components/CText';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import MyRecruiter from './MyRecruiter';
// import Carousel from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import CSubscriptionCard from '../../components/CSubscriptionCard';
import { getUserData } from '../../services/UserDataService';
import { getSubscription, getSubscriptionMapping } from '../../services/SubscriptionService';
import CCustomizeSubscriptionCard from '../../components/CCustomizeSubscriptionCard';
// import { ScrollView } from 'react-native-gesture-handler';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const Subscription = () => {
  const [subscriptionData, setSubscriptionData] = useState([])
    const [userData, setUserData] = useState(null)
    const [refresh, setRefresh] = useState(true)
    const [alreadySubscribed, setAlreadySubscribed] = useState(null)
    const isFocused = useIsFocused();
    useEffect(()=>{
      const fetchData = async() => {
        let ud = await getUserData();
        setUserData(ud);
  
        let subData = await getSubscription("company", "0");
        console.log(subData)
        setSubscriptionData(subData);
  
        let currentSub = await getSubscriptionMapping(ud?.company_id, "0")
        console.log(currentSub.length,"------------->")
        setAlreadySubscribed(currentSub?.length ? true : false)
      } 
      fetchData();
    },[isFocused, refresh])

  return (
    <ScrollView
      style={styles.container}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      snapToInterval={width * 0.90 + 15}  // Width of the card + margin
      snapToAlignment="center"  // Ensures the card snaps to the center of the screen
      decelerationRate="fast"  // Makes the scroll stop more abruptly after you swipe
      contentInsetAdjustmentBehavior="automatic" // Ensures the card is properly aligned when snapping
    >
      {subscriptionData?.map((subscription, index) => (
        <CSubscriptionCard key={index} name={subscription.subscription_name} price={subscription.subscription_price} recruiterCount={subscription?.subscription_description} timeSpan={subscription.subscription_application_count} description={subscription.subscription_details} id={subscription.subscription_id} applicantId={userData?.company_id} buttonText={"Subscribe"} runFunc={true} userData={userData} refreshFunc={()=>setRefresh((prev)=>!prev)} />
      ))}
      <CCustomizeSubscriptionCard userData={userData} applicantId={userData?.company_id} refreshFunc={()=>setRefresh((prev)=>!prev)} id={"10"} />
      <View style={{width:20}}></View>
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