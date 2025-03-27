import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { Text } from "react-native-paper";
import CText from "../../components/CText";

const CustomHeader = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        // marginTop: 10,
        backgroundColor: "#053766",
      }}
    >
      {navigation.canGoBack() && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 10 }}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}
      <CText
        sx={{ flex: 1, textAlign: "center" }}
        fontSize={18}
        fontWeight={600}
        color={"white"}
      >
        {title}
      </CText>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home", { screen: "Profile" })}
      >
        <Icon name="person-circle" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default CustomHeader;
