import { View, Image, StyleSheet, Dimensions, Text, Alert } from 'react-native';
import React, { useEffect } from 'react';
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

const Splash = () => {
    const navigation = useNavigation();

    function handleGetStart() {
        navigation.navigate('Get Started')
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/splash/splashScreenImage.jpg')}
                style={styles.image}
                resizeMode="contain" // Adjust this as needed
            />
            <Text style={{ fontSize: 30, color: "#000", fontWeight: 600, textAlign: "center", paddingHorizontal: 20 }}>Welcome to the future of work.</Text>
            <Text style={{ fontSize: 18, color: "#403f3e", fontWeight: 400, textAlign: "center", paddingHorizontal: 20, marginTop: 15 }}>Find your next job, learn new skills or hire top talent. All on one top platform</Text>
            <Button style={{borderRadius:5}} width={width * 0.9} marginTop={20} mode="contained" buttonColor={"black"} onPress={handleGetStart}>
                Get Started
            </Button>
            <View style={styles.bottomTextContainer}>
                <Text style={styles.bottomText}>
                    By clicking "Get Started" you agree to our Terms of Service and Privacy Policy
                </Text>
            </View>
        </View>
    );
}

export default Splash;
