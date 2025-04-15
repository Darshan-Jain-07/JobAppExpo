import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { Text } from "react-native-paper";
import CText from "../../components/CText";
import { StatusBar } from "expo-status-bar";

const CustomHeader = ({ title, chat, profileIcon=true }) => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          marginTop: 20,
          backgroundColor: "#000",
          paddingHorizontal: 10,
        }}
      >
        {navigation.canGoBack() && !chat && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        {navigation.canGoBack() && chat && (
          <TouchableOpacity onPress={() => navigation.navigate("ChatList")}>
            <Icon name="chatbubble-ellipses-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <CText
          sx={{ flex: 1, textAlign: "center" }}
          fontSize={18}
          fontWeight={600}
          color={"#fff"}
        >
          {title}
        </CText>
        {profileIcon ? <TouchableOpacity
          onPress={() => navigation.navigate("Home", { screen: "Profile" })}
        >
          <Icon name="person-circle" size={30} color="white" />
        </TouchableOpacity> : <View style={{ width: 30, height: 30 }} />}
      </View>
    </>
  );
};

export default CustomHeader;
