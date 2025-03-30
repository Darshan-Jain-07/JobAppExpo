import React, { useEffect } from "react";
import { View, Animated, Image, StyleSheet } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { getUserData } from "../services/UserDataService";

const Splash = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(async () => {
        // SplashScreen.hide(); // Hide native splash screen
        // navigation.replace("Home"); // Navigate to Home screen
        // async function handleGetStart() {
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
        // }
      }, 1000);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/images/logo.jpeg")} // Replace with your logo path
        style={[styles.logo, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 150,
  },
});

export default Splash;
