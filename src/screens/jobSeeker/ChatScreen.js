import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import io from 'socket.io-client';
import Icon from 'react-native-vector-icons/FontAwesome';

const socket = io('http://192.168.5.45:3001'); // Your backend server URL

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [userId, setUserId] = useState(1); // You can set userId dynamically after login

  // Load previous messages when the component mounts
  useEffect(() => {
    socket.emit('loadMessages'); // Request messages from the server
    socket.on('messages', (messages) => {
      console.log(messages);
      setMessages(messages); // Set previous messages in state
    });

    socket.on('newMessage', (newMessage) => {
      console.log(newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Add new message to state
    });

    return () => {
      socket.off('messages');
      socket.off('newMessage');
    };
  }, []);

  const sendMessage = () => {
    if (messageText.trim()) {
      // Emit the message to the server
      socket.emit('sendMessage', { userId, message: messageText });
      setMessageText(''); // Clear the input field
    }
  };

  const renderItem = ({ item }) => {
    const isCurrentUser = item.userId === userId;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.messageRight : styles.messageLeft,
        ]}
      >
        {!isCurrentUser && <Text style={styles.messageUser}>{item.username}</Text>}
        <View style={isCurrentUser ? styles.messageBubbleRight : styles.messageBubbleLeft}>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        inverted // To make the messages scroll up like WhatsApp
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e5ddd5',
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  messageRight: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  messageLeft: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  messageUser: {
    fontWeight: 'bold',
    color: '#555',
    marginRight: 5,
  },
  messageBubbleRight: {
    backgroundColor: '#0078FE', // Blue for the current user's message
    borderRadius: 15,
    padding: 10,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  messageBubbleLeft: {
    backgroundColor: '#ffffff', // White for the other user's message
    borderRadius: 15,
    padding: 10,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#0078FE',
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
});

export default ChatScreen;
