import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_BASE_URL } from '@env'; // Ensure you have the correct path to your .env file

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  const apiKey = 'AIzaSyC8jTwFY_6kXngGiFuOB0ft6FlAIqAZvAo';
  const apiUrl = `${API_BASE_URL}/chatbot`; // Replace with your actual API URL

  const renderFormattedText = (text) => {
    const lines = text.split('\n');
    const formatted = [];

    lines.forEach((line, index) => {
      if (line.trim() === '') {
        formatted.push(<Text key={`empty-${index}`}>{'\n'}</Text>);
      } else if (line.trim().startsWith('*')) {
        const bulletText = line.replace(/^\*\s*/, '');
        formatted.push(
          <View key={`bullet-${index}`} style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Text style={{ color: '#fff' }}>• </Text>
            {renderBoldChunks(bulletText, index)}
          </View>
        );
      } else {
        formatted.push(
          <Text key={`line-${index}`} style={{ color: '#fff', marginBottom: 2 }}>
            {renderBoldChunks(line, index)}
          </Text>
        );
      }
    });

    return formatted;
  };

  const renderBoldChunks = (text, parentKey) => {
    const chunks = text.split(/(\*\*[^*]+\*\*)/g); // e.g., splits into normal, **bold**, normal
    return chunks.map((chunk, idx) => {
      if (chunk.startsWith('**') && chunk.endsWith('**')) {
        return (
          <Text key={`${parentKey}-${idx}`} style={{ fontWeight: 'bold', color: '#fff' }}>
            {chunk.slice(2, -2)}
          </Text>
        );
      }
      return (
        <Text key={`${parentKey}-${idx}`} style={{ color: '#fff' }}>
          {chunk}
        </Text>
      );
    });
  };

  const generateContent = async (query) => {
    const requestData = {
      prompt: query
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      console.log('API Response:', data); // Log the API response for debugging
      const responseText = data?.response;
      return responseText;
    } catch (error) {
      console.error('Error fetching the API:', error);
      return 'There was an error fetching the content. Please try again.';
    }
  };

  const sendMessage = async () => {
    if (inputText.trim()) {
      const newMessage = { text: inputText, sender: 'user', timestamp: new Date() };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
      setIsTyping(true);

      // Call the Gemini API to generate the bot response
      const botResponse = await generateContent(inputText);
      const botMessage = { text: botResponse, sender: 'bot', timestamp: new Date() };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsTyping(false);

      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.messageRow}>
      {item.sender === 'bot' && <Image source={require('../../assets/images/bot-avatar.png')} style={styles.avatar} />}
      <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer]}>
        <View style={styles.messageContent}>
        <View style={styles.messageText}>{item.sender === 'bot' ? renderFormattedText(item.text) : <Text style={{ color: '#fff' }}>{item.text}</Text>}</View>

          <Text style={styles.timestamp}>{item.timestamp.toLocaleTimeString()}</Text>
        </View>
      </View>
      {item.sender === 'user' && <Image source={require('../../assets/images/user-avatar.png')} style={styles.avatar} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }}
      />
      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color="#ffffff" />
          <Text style={styles.typingText}>Bot is typing...</Text>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message"
          placeholderTextColor="#888"
          editable={!isTyping}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={isTyping}>
          <Icon name="send" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  messagesList: {
    padding: 10,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
    maxWidth: '90%',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
    maxWidth: '100%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E88E5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 10,
    marginLeft: 90,
    maxWidth: '100%',
  },
  botMessageContainer: {
    maxWidth: '70%',
    alignSelf: 'flex-start',
    backgroundColor: '#333333',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    padding: 10,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    color: '#ffffff',
  },
  timestamp: {
    fontSize: 10,
    color: '#888888',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  typingText: {
    color: '#ffffff',
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    backgroundColor: '#1c1c1c',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
  },
  sendButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default ChatScreen;