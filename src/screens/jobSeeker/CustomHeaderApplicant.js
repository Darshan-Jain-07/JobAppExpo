import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from 'react-native-paper';
import CText from '../../components/CText';
import { StatusBar } from 'expo-status-bar';

const CustomHeader = ({ title, chat }) => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="transparent" />
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, marginTop: 30 }}>
        {navigation.canGoBack() && !chat && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
            <Icon name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        )}
        {navigation.canGoBack() && chat && (
          <TouchableOpacity
            onPress={() => navigation.navigate('ChatList')}>
            <Icon name="chatbubble-ellipses-outline" size={24} color="black" />
          </TouchableOpacity>
        )}
        <CText sx={{ flex: 1, textAlign: 'center' }} fontSize={18} fontWeight={600}>{title}</CText>
        <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'Profile' })}>
          <Icon name="person-circle" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CustomHeader;
