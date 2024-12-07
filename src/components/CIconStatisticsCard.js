import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Example icon
import CText from './CText';

const { width } = Dimensions.get('window'); // Get screen width

const CStatisticsCard = ({ label, value, iconName, onPress=()=>{} }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Icon name={iconName} size={45} color="#000" style={styles.icon} />
      <View style={styles.textContainer}>
        <CText sx={styles.text}>{label}</CText>
        <CText sx={styles.number} fontWeight={700} fontSize={18}>{value}</CText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width / 2 - 15, // Half of the screen width
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    height: '100%',
    justifyContent: 'center',
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  number: {
    fontSize: 14,
  },
});

export default CStatisticsCard;
