import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import io from 'socket.io-client';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { getUserData } from '../../services/UserDataService';

// Your backend server URL
const SOCKET_SERVER_URL = 'http://localhost:3001'; 

// Establish socket connection
const socket = io(SOCKET_SERVER_URL);

const ChatScreen = () => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [senderId, setSenderId] = useState(null);
  
  // Get recipientId from route params (passed in navigation)
  const { recipientId } = route.params;


  // Fetch messages from the database on initial load
  useEffect(() => {
    const userData = getUserData();
    setSenderId(userData);

    // Fetch previous chat messages from the backend
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${SOCKET_SERVER_URL}/messages/${userId}/${recipientId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [recipientId]);

  // Handle sending a message
  const sendMessage = () => {
    if (messageText.trim() === '') return;

    const message = {
      senderId,
      recipientId,
      text: messageText,
    };

    // Emit the message to the backend (via WebSocket)
    socket.emit('sendMessage', message);

    // Update the local messages list for immediate UI update
    const newMessage = {
      _id: Math.random().toString(36).substring(7),
      text: messageText,
      createdAt: new Date(),
      user: { _id: senderId, name: 'Current User' }, // Replace 'Current User' with actual name
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Optionally, store the message in the backend database
    axios.post(`${SOCKET_SERVER_URL}/messages`, message).catch(console.error);

    // Clear the message input field
    setMessageText('');
  };

  // Listen for new messages coming from the backend (via WebSocket)
  useEffect(() => {
    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('message');
    };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.user._id === senderId ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item._id}
        inverted
      />

      <KeyboardAvoidingView
        style={styles.inputContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  sentMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#E4E6EB',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
});

export default ChatScreen;
