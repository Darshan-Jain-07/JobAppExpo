import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import CText from './CText';
import { Button } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const stylesClickableCard = StyleSheet.create({
    card: {
        width: "44%",
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 5, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        backgroundColor: '#fff',
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

const CStatisticsCard = ({ label, onPress, value }) => {

    return (
        <TouchableOpacity style={stylesClickableCard.card} onPress={onPress}>
            <CText sx={{marginTop:20, paddingLeft:15}} fontSize={20} fontWeight={500}>{label}</CText>
            <CText sx={{marginVertical:20, paddingLeft:15}} fontSize={30} fontWeight={700}>{value}</CText>
            {/* <Button contentStyle={{flexDirection:"row-reverse"}} icon={"arrow-right"} labelStyle={{color:"blue"}}>View Details</Button> */}
        </TouchableOpacity>
    );
}

export default CStatisticsCard;