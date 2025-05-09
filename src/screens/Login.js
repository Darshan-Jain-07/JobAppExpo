import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Menu,
  Divider,
  TextInput,
  DefaultTheme,
} from "react-native-paper";
import Icon from "react-native-vector-icons/AntDesign";
import { Dropdown } from "react-native-paper-dropdown";
import { Provider as PaperProvider } from "react-native-paper";
import * as Yup from "yup";
import { ErrorMessage, Formik } from "formik";
import { logIn } from "../services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CText from "../components/CText";

const { width, height } = Dimensions.get("window");
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#000",
    accent: "#f1c40f",
  },
};
const validationSchema = Yup.object().shape({
  role: Yup.string().required("Role is required"),
  email: Yup.string()
    .matches(/^[^@]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,}$/, "Invalid Email")
    .test("only-one-dot", "Invalid Email", (value) => {
      // Check if the email contains exactly one dot after the '@'
      const dotCount = (value.match(/\./g) || []).length;
      return dotCount === 1;
    })
    .required("Email is required"),
  password: Yup.string()
    // .min(8, 'Password must be at least 8 characters')
    .required("Password is required"),
});

const initialValues = {
  role: "",
  email: "",
  password: "",
};

const OPTIONS = [
  { label: "Job Seeker", value: "applicant" },
  { label: "Recruiter", value: "recruiter" },
  { label: "Company", value: "company" },
];

const Login = () => {
  const navigation = useNavigation();
  function handleBack() {
    navigation.navigate("Get Started");
  }
  async function handleSubmit(values) {
    console.log(values);
    let response = await logIn(values.role, values.email, values.password);
    console.log(response);
    if (!response.length) {
      Alert.alert("Failed", "Incorrect Credentials!");
    } else {
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({ ...response?.[0], role: values.role })
      );
      if (values.role === "company") {
        navigation.navigate("Bottom Navigation App");
      } else if (values.role === "applicant") {
        navigation.navigate("Bottom Navigation Applicant");
      } else if (values.role === "recruiter") {
        navigation.navigate("Bottom Navigation Recruiter");
      }
      // await AsyncStorage.setItem('role', values.role);
    }
  }
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  return (
    <PaperProvider theme={theme}>
      <ScrollView>
        <View style={styles.container}>
          <Button
            mode="text"
            icon="keyboard-backspace"
            onPress={handleBack}
            style={{
              display: "flex",
              alignItems: "flex-start",
              paddingLeft: 10,
              marginTop: 20,
            }}
            labelStyle={{ color: "black" }} // Use labelStyle for text color
          >
            Back
          </Button>
          <CText
            fontWeight={600}
            fontSize={25}
            sx={{ color: "#000", textAlign: "center", marginTop: 5 }}
          >
            Login
          </CText>
          {/* Image Section */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/login/login.png")}
              style={styles.loginImage}
              resizeMode="contain"
            />
          </View>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlue,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <View>
                <View style={{ margin: 16 }}>
                  <Dropdown
                    label="Role"
                    name="role"
                    placeholder="Select Role"
                    options={OPTIONS}
                    value={values.role}
                    onSelect={(value) => {
                      setFieldValue("role", value);
                    }}
                    mode={"outlined"}
                    dropdownStyle={{ backgroundColor: "#000" }}
                    itemStyle={{ color: "#6200ea", fontSize: 16 }}
                  />
                  <ErrorMessage
                    name="role"
                    component={CText}
                    fontSize={12}
                    color={"red"}
                  />
                </View>
                <View>
                  <TextInput
                    label="Email"
                    style={{
                      marginHorizontal: 15,
                    }}
                    value={values.email}
                    autoCapitalize="none"
                    onChangeText={(text) => setFieldValue("email", text)}
                    mode="outlined"
                    dropDownItemStyle={styles.dropDownItem}
                    dropDownItemSelectedStyle={styles.dropDownItemSelected}
                  />
                  <ErrorMessage
                    name="email"
                    component={CText}
                    fontSize={12}
                    color={"red"}
                    sx={{ marginHorizontal: 16 }}
                  />
                </View>
                <TextInput
                  label="Password"
                  style={{
                    marginHorizontal: 15,
                  }}
                  value={values.password}
                  secureTextEntry={secureTextEntry}
                  onChangeText={(pass) => setFieldValue("password", pass)}
                  mode="outlined"
                  right={
                    <TextInput.Icon
                      icon={secureTextEntry ? "eye-off" : "eye"}
                      onPress={() => setSecureTextEntry(!secureTextEntry)}
                    />
                  }
                />
                <ErrorMessage
                  name="password"
                  component={CText}
                  fontSize={12}
                  color={"red"}
                  sx={{ marginHorizontal: 16 }}
                />
                <View style={{ marginHorizontal: 16 }}>
                  <Button
                    style={styles.loginBtn}
                    marginTop={20}
                    mode="contained"
                    onPress={handleSubmit}
                  >
                    <Text style={styles.loginTxt}> Login</Text>
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f0f0",
  },

  loginBtn: {
    backgroundColor: "#000",
    borderWidth: 2, // Add border
    borderColor: "#000", // Set border color
  },
  loginTxt: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    // marginVertical: 10, // Adjust spacing
  },
  loginImage: {
    width: 350, // Set width
    height: 250, // Set height
    borderRadius: 10, // Optional: Add rounded corners
  },
});

export default Login;
