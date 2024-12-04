import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import CText from './CText';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    card: {
        width: width * 0.85,
        height: height * 0.7,
        padding: 20,
        backgroundColor: '#000000',
        borderRadius: 10,
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    subscriptionName: {
        color: "#ffffff",
    },
    header: {
        flexDirection: 'row',
    },
    price: {
        color: '#fff',
        marginBottom: 16,
        marginTop: 20,
        textAlign: 'left',
    },
    descriptionContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    descriptionItem: {
        fontSize: 16,
        color: '#cfd0d4',
        marginBottom: 6,
    },
    button: {
        backgroundColor: '#2e2f30',
        paddingVertical: 12,
        position: "absolute",
        borderRadius: 6,
        bottom: 20,
        width: width * 0.7,
        right: width * 0.08,
        marginHorizontal: "auto",
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
    },
});

const CSubscriptionCard = ({ name, price, timeSpan, description, buttonText }) => {

    return (
        <View style={styles.card}>
            <CText sx={styles.subscriptionName} fontWeight={800} fontSize={30}>{name}</CText>

            <View style={styles.header}>
                <CText sx={styles.price} fontSize={50}>{price}</CText>
                <CText sx={{ color: "#797b82", marginTop: 45 }} fontSize={25} fontWeight={900}>{timeSpan}</CText>
            </View>

            <View style={styles.descriptionContainer}>
                <CText fontSize={18} sx={styles.descriptionItem}>Benefits:-</CText>
                {description.map((point, index) => (
                    <CText key={index} fontSize={18} sx={styles.descriptionItem}>
                        <FontAwesomeIcon size={20} name="check-circle" /> {point}
                    </CText>
                ))}
            </View>

            <TouchableOpacity style={styles.button}>
                <CText sx={styles.buttonText} fontSize={20} fontWeight={600}>{buttonText}</CText>
            </TouchableOpacity>
        </View>
    );
}

export default CSubscriptionCard;