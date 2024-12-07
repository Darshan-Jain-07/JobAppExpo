import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, IconButton } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const ClickableCard = ({ image, onPress, name }) => {
    return (
        <TouchableOpacity style={stylesClickableCard.card} onPress={onPress}>
            <Image
                source={image}
                style={stylesClickableCard.image}
                resizeMode="cover"
            />
            <Text style={stylesClickableCard.text}>{name}</Text>
        </TouchableOpacity>
    );
};

const stylesClickableCard = StyleSheet.create({
    card: {
        width: "43%",
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 5, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        backgroundColor: '#fff',
        alignItems: 'center',
        margin: 10,
    },
    image: {
        width: '100%',
        height: 180,
    },
    text: {
        padding: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 25,
        color: "#000",
        fontWeight: '600',
        textAlign: "left",
        marginTop: 20,
    },
    subtitle: {
        fontSize: 18,
        color: "#666565",
        fontWeight: '400',
        textAlign: "left",
        marginTop: 10,
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: "wrap",
        marginBottom: 10,
        marginTop: 20,
        paddingHorizontal: 20,
    },
    card: {
        //   width: '20%',
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    cardText: {
        fontSize: 16,
    },
});

const Signup = () => {

    const navigation = useNavigation();

    function handleJobSeeker() {
        navigation.navigate('Sign Up Job Seeker')
    }

    function handleRecruiter() {
        navigation.navigate('Sign Up Recruiter')
    }

    function handleCompany() {
        navigation.navigate('Sign Up Company')
    }

    function handleBack() {
        navigation.navigate('Get Started')
    }

    roleArray = [
        { key: 1, name: "Job Seeker", image: require('../assets/images/signup/jobSeeker.jpg'), onPress: handleJobSeeker },
        { key: 2, name: "Recruiter", image: require('../assets/images/signup/recruiter.jpg'), onPress: handleRecruiter },
        { key: 3, name: "Company", image: require('../assets/images/signup/company.jpg'), onPress: handleCompany },
    ]

    return (
        <View>
            <Button
                mode="text"
                icon="keyboard-backspace"
                onPress={handleBack}
                style={{ display:"flex", alignItems:"flex-start", paddingLeft:10, marginTop:20}}
                labelStyle={{ color: 'black' }} // Use labelStyle for text color
            >
                Back
            </Button>

            <Text style={{ fontSize: 25, color: "#000", fontWeight: 600, textAlign: "left", marginTop: 20, paddingHorizontal: 20 }}>Great to see you! Can you let us know your role?</Text>
            <Text style={{ fontSize: 18, color: "#666565", fontWeight: 400, textAlign: "left", marginTop: 10, paddingHorizontal: 20 }}>Understanding your role helps us serve your needs better!</Text>
            <View style={styles.cardContainer}>
                {roleArray.map((d) => {
                    return <ClickableCard key={d.key} image={d.image} name={d.name} onPress={d.onPress} />
                })}
            </View>
        </View>
    )
}

export default Signup;