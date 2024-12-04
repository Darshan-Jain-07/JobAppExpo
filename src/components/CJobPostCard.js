import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import CText from './CText'
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';


function CJobPostCard({ title, description, location, date, hires, onPress }) {
    return (
        <View>
            <TouchableOpacity style={styles.jobPostCard} onPress={onPress}>
                <View>
                    <CText fontSize={25} fontWeight={600} sx={styles.jobTitle}>{title}</CText>
                    <CText fontSize={18} sx={styles.jobDescription}>{description}</CText>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View flexDirection="row">
                            <EvilIcons
                                marginTop={10}
                                name="location"
                                size={20}
                                color="#888"
                            />
                            <CText fontSize={14} sx={styles.jobLocation}>{location}</CText>
                        </View>
                        <View flexDirection="row">
                            <FontAwesomeIcon
                                marginTop={10}
                                marginLeft={20}
                                name="calendar-o"
                                size={15}
                                color="#888"
                            />
                            <CText fontSize={12} fontWeight={500} sx={styles.date}>{date}</CText>
                        </View>
                    </View>
                </View>
                <View flex={1} style={styles.hireIconContainer}>
                    <Ionicons
                        name="people"
                        size={20}
                        color="#000"
                    />
                    <CText fontSize={17} fontWeight={600} sx={styles.hireCount}>{hires}</CText>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default CJobPostCard

const styles = StyleSheet.create({
    jobPostCard: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    jobTitle: {
        fontSize: 18,
        color: '#000',
    },
    jobLocation: {
        fontSize: 14,
        color: '#888',
        marginTop: 10,
    },
    jobDescription: {
        fontSize: 16,
        color: '#333',
        marginTop: 10,
    },
    date: {
        fontSize: 15,
        marginLeft: 5,
        color: '#888',
        marginTop: 10,
    },
    hireIconContainer: {
        position: 'absolute',
        top: 10,
        right: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        padding: 5,
        flexDirection: "row",
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    hireCount: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 5,
    },
});
