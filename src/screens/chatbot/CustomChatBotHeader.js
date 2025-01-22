import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the Ionicons icon set

const CustomChatBotHeader = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#333333" />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text>
                        <Icon name="arrow-back" size={24} color="#ffffff" /> {/* Use the back icon */}
                    </Text>
                </TouchableOpacity>
                <Image source={require('../../assets/images/bot-avatar.png')} style={styles.logo} />
                <Text style={styles.title}>ChatBot</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#333333',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        paddingTop: StatusBar.currentHeight || 20, // Add padding to avoid overlap with the status bar
        backgroundColor: '#333333',
    },
    backButton: {
        marginRight: 10,
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    title: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default CustomChatBotHeader;