import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';  // Using FontAwesome for icons

// Sample data for payment history
const paymentHistory = [
  {
    id: '1',
    amount: '$250.00',
    date: '2024-10-15',
    method: 'credit-card',  // can use different methods like PayPal, Bank Transfer, etc.
    status: 'Completed',
    image: 'https://via.placeholder.com/50', // Example image URL for the transaction
    subscriptionName: 'Premium Plan',
    bankDetails: 'Account No: 1234567890, Bank: ABC Bank',
  },
  {
    id: '2',
    amount: '$450.00',
    date: '2024-09-20',
    method: 'paypal',
    status: 'Completed',
    image: 'https://via.placeholder.com/50', // Example image URL for the transaction
    subscriptionName: 'Standard Plan',
    bankDetails: 'Account No: 0987654321, Bank: XYZ Bank',
  },
  {
    id: '3',
    amount: '$120.00',
    date: '2024-08-12',
    method: 'bank',
    status: 'Pending',
    image: 'https://via.placeholder.com/50', // Example image URL for the transaction
    subscriptionName: 'Basic Plan',
    bankDetails: 'Account No: 1122334455, Bank: DEF Bank',
  },
];

const PaymentHistoryScreen = () => {
  // State to track which item is expanded
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Function to toggle the accordion
  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);  // Toggle open/close
  };

  // Function to render each payment history item
  const renderPaymentItem = ({ item, index }) => {
    // Render icons based on the payment method
    let paymentIcon;
    switch (item.method) {
      case 'credit-card':
        paymentIcon = 'credit-card';
        break;
      case 'paypal':
        paymentIcon = 'paypal';
        break;
      case 'bank':
        paymentIcon = 'university';
        break;
      default:
        paymentIcon = 'credit-card';
        break;
    }

    // Animated height for the accordion
    const expandHeight = expandedIndex === index ? 'auto' : 0;

    return (
      <View style={styles.paymentItemContainer}>
        <TouchableOpacity
          style={styles.paymentItem}
          onPress={() => toggleAccordion(index)} // Toggle expansion
        >
          <Image source={{ uri: item.image }} style={styles.paymentImage} />
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentAmount}>{item.amount}</Text>
            <Text style={styles.paymentDate}>{item.date}</Text>
            <Text style={[styles.paymentStatus, item.status === 'Completed' ? styles.completed : styles.pending]}>
              {item.status}
            </Text>
          </View>
          <Icon name={paymentIcon} size={30} color="#333" style={styles.paymentIcon} />
        </TouchableOpacity>

        {/* Accordion Expandable Section */}
        <Animated.View style={[styles.expandedSection, { height: expandHeight }]}>
          <View style={styles.expandedContent}>
            <Text style={styles.subscriptionName}>Subscription: {item.subscriptionName}</Text>
            <Text style={styles.bankDetails}>Bank Details: {item.bankDetails}</Text>
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={paymentHistory}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentItemContainer: {
    marginBottom: 15,
  },
  paymentItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,  // for Android shadow
    alignItems: 'center',
  },
  paymentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  paymentStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  completed: {
    color: 'green',
  },
  pending: {
    color: 'orange',
  },
  paymentIcon: {
    marginLeft: 10,
  },
  expandedSection: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
  },
  expandedContent: {
    padding: 15,
  },
  subscriptionName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  bankDetails: {
    fontSize: 14,
    color: '#777',
  },
});

export default PaymentHistoryScreen;
