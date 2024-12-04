import { View, Text, Dimensions, StyleSheet, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    image: {
        width: width,
        height: height / 2,
    },
    bottomTextContainer: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    bottomText: {
        fontSize: 15,
        color: "#666565",
        fontWeight: '400',
        textAlign: "center",
        paddingHorizontal: 20,
    },
});

const GetStarted = () => {

    const navigation = useNavigation();

    function handleLogin() {
        navigation.navigate('Log In');
    }
    
    function handleSignup() {
        navigation.navigate('Sign Up');
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/splash/splashScreenImage.jpg')}
                style={styles.image}
                resizeMode="contain" // Adjust this as needed
            />
            <Text style={{ fontSize: 30, color: "#000", fontWeight: 600, textAlign: "center", paddingHorizontal: 20 }}>Welcome to the future of work.</Text>
            <View style={{ flexDirection:"row", gap:5}}>
                <Button style={{ borderRadius: 5 }} width={width * 0.4} marginTop={20} mode="contained" buttonColor={"black"} onPress={handleSignup}>
                    Sign Up
                </Button>
                <Button style={{ borderRadius: 5, borderColor:"black", borderWidth:2 }} width={width * 0.4} marginTop={20} mode="contained" textColor='black' buttonColor={"white"} onPress={handleLogin}>
                    Log in
                </Button>
            </View>
            <View style={styles.bottomTextContainer}>
                <Text style={styles.bottomText}>
                    By signing up, you agree to our Terms and Privacy Policy
                </Text>
            </View>
        </View>
    )
}

export default GetStarted;