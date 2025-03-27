import { View, Image, StyleSheet, Dimensions, Text, Alert } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { clearUserData, getUserData } from "../services/UserDataService";
import CText from "../components/CText";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    width: width,
    height: height / 2,
  },
  bottomTextContainer: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bottomText: {
    fontSize: 10,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

const Splash = () => {
  const navigation = useNavigation();
  async function handleGetStart() {
    let userData = await getUserData();
    console.log(userData);
    if (userData?.role === "company") {
      navigation.navigate("Bottom Navigation App");
    } else if (userData?.role === "applicant") {
      navigation.navigate("Bottom Navigation Applicant");
    } else if (userData?.role === "recruiter") {
      navigation.navigate("Bottom Navigation Recruiter");
    } else {
      navigation.navigate("Get Started");
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/splash/Splash.png")}
        style={styles.image}
        resizeMode="contain" // Adjust this as needed
      />
      <CText
        fontWeight={600}
        fontSize={25}
        sx={{ color: "#000", textAlign: "center", paddingHorizontal: 20 }}
      >
        Welcome to the future of work.
      </CText>
      <CText
        sx={{
          fontSize: 15,
          color: "#403f3e",
          fontWeight: 400,
          textAlign: "center",
          paddingHorizontal: 20,
          marginTop: 15,
        }}
      >
        Find your next job, learn new skills or hire top talent. All on one top
        platform
      </CText>
      <Button
        style={{ borderRadius: 5 }}
        width={width * 0.9}
        marginTop={20}
        mode="contained"
        buttonColor={"black"}
        onPress={handleGetStart}
      >
        Get Started
      </Button>
      <View style={styles.bottomTextContainer}>
        <CText color={"#666565"} fontWeight={400} sx={styles.bottomText}>
          By clicking "Get Started" you agree to our Terms of Service and
          Privacy Policy
        </CText>
      </View>
    </View>
  );
};

export default Splash;
