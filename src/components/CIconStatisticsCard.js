import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Example icon
import CText from "./CText";

const { width } = Dimensions.get("window"); // Get screen width

const CStatisticsCard = ({ label, value, iconName, onPress = () => {} }) => {
  const getCardColor = (label) => {
    switch (label) {
      case "RQS":
        return { icon: "#b55e12", text: "#b55e12" }; // Gold
      case "Applied":
        return { icon: "#154782", text: "#154782" }; // Green
      case "Accepted":
        return { icon: "#105710", text: "#105710" }; // Blue
      case "Rejected":
        return { icon: "#8a0f1c", text: "#8a0f1c" }; // Red
      default:
        return { icon: "#000", text: "#000" }; // Default Black
    }
  };
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Icon
        name={iconName}
        size={45}
        color={getCardColor(label).icon}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <CText sx={[styles.text, { color: getCardColor(label).text }]}>
          {label}
        </CText>
        <CText sx={styles.number} fontWeight={700} fontSize={18}>
          {value}
        </CText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "35%", // Ensures two columns layout
    aspectRatio: 1, // Makes the card square
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa", // Light gray background
    borderRadius: 10,
    padding: 10,
    elevation: 3, // Shadow effect for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    height: "50%",
    // color: "#888",
  },
  textContainer: {
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    color: "#555",
  },
  number: {
    fontSize: 14,
  },
});

export default CStatisticsCard;
